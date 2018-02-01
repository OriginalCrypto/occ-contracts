const OriginalToken = artifacts.require('OriginalToken'),
      tokenName = 'Original Crypto Coin',
      tokenSymbol = 'OCC',
      decimals = 18
      
let   originalToken,
      founder,
      airdropCampaign,
      OneHundredBillionPlusDecimals = Math.pow(10,(11 + decimals)),
      cofounderDistribution = 55 * Math.pow(10, (8 + decimals)),
      cofounders;

contract('OriginalToken', function (accounts) {
  founder = accounts[0];
  airdropCampaign = accounts[1];
  cofounders = accounts.slice(2, 16);

  before(async function () {
    originalToken = await OriginalToken
      .new(cofounders, airdropCampaign, OneHundredBillionPlusDecimals,
          tokenName, tokenSymbol, decimals, cofounderDistribution, { from: founder });
  });

  // TODO: revisit after implementing initial cofounder distribution
  it('should create an initial balance of 5.5 billion for the creator', async function ()  {
        let balance = await originalToken.balanceOf.call(founder);
        assert.equal(balance.toNumber(), cofounderDistribution);
  });

  it('should give each cofounder an equal distribution', async function () {
    let instance = await  OriginalToken
      .new(cofounders, airdropCampaign, 2000, tokenName, tokenSymbol, 2, 2, { from: founder });

    let recordedCofounders = await instance.getCofounders.call();

    let balancesOfRecordedCofounders = [];
    recordedCofounders
      .forEach(async function (recordedCofounder) {
        let balancesOfRecordedCofounder = await instance.balanceOf.call(recordedCofounder);
        balancesOfRecordedCofounders.push(balancesOfRecordedCofounder);
      });

    assert.ok(balancesOfRecordedCofounders.every(function (distribution) { return distribution.toNumber() == 2; }));
  });

  it('sets name, symbol, decimals and airdrop address correctly', async function () {

    const name = await originalToken.name.call();
    assert.strictEqual(name, 'Original Crypto Coin');

    const symbol = await originalToken.symbol.call();
    assert.strictEqual(symbol, 'OCC');

    const decimals = await originalToken.decimals.call();
    assert.equal(decimals.toNumber(), 18);
  });

  it('transfers tokens from one account to another', async function () {
    const recipient = '0x347eD75c305f4ab85757Bfcc5600D9BfCb413898';
    await originalToken.transfer(recipient, 10000, { from: cofounders[cofounders.length - 1] });
    
    const balance = await originalToken.balanceOf.call(recipient);
    assert.equal(balance.toNumber(), 10000);
  });

  it('fails to transfer more tokens than sender has', async function () {
    const recipient = '0x347eD75c305f4ab85757Bfcc5600D9BfCb413898',
          instance = await  OriginalToken
            .new(cofounders, airdropCampaign, 2000, tokenName, tokenSymbol, 2, 2, { from: founder });

    await reverts(instance.transfer(recipient, 3, { from: founder }));
  });

  it('succeeds when transfering 0 tokens', async function () {
    const recipient = '0x347eD75c305f4ab85757Bfcc5600D9BfCb413898',
          result = await originalToken.transfer.call(recipient, 0, { from: founder });
    assert(result);
  });

  it('prevents token transfers to address(0)', async function () {
    try {
      await originalToken.transfer('0x0000000000000000000000000000000000000000', 1, { from : cofounders[1] });
      assert.fail('expected revert but ran to completion.');
    } catch(e) {
      const hasReverted = e.message.search(/revert/) > -1;
      assert(hasReverted, `expected revert but threw ${e}`);
    }
  });


  it('should reject receiving ether', async function () {
    const balanceBefore = await web3.eth.getBalance(originalToken.address);
    assert.equal(balanceBefore.toNumber(), 0, `balance before: ${balanceBefore.toNumber()} should be zero`);

    try {
      let result = await web3.eth.sendTransaction({
        from: founder,
        to: originalToken.address,
        value: web3.toWei('10', 'ether'),
        data: '0x01'
      });

      assert.fail('expected revert but ran to completion.');
    } catch (e) {
      const hasReverted = e.message.search(/revert/) > -1;
      assert(hasReverted, `expected revert but threw ${e}`);
    }
  
    const balanceAfter = await web3.eth.getBalance(originalToken.address);
    assert.equal(balanceAfter.toNumber(), 0, `balance after: ${balanceAfter.toNumber()} should be zero`);

  });

  it('should not have token balance side effects during ether \'receive\' transaction', async function () {
    const balanceBefore = await originalToken.balanceOf.call(founder);

    assert.strictEqual(balanceBefore.toNumber(), cofounderDistribution);

    try {
      let result = await web3.eth.sendTransaction({
          from: founder,
          to: originalToken.address,
          value: web3.toWei('10', 'ether'),
          data: '0x'
      });

      assert.fail('expected revert but ran to completion.');
    } catch (e) {
      const hasReverted = e.message.search(/revert/) > -1;
      assert(hasReverted, `expected revert but threw ${e}`);
    }
    // sending ether should not have side affects on the token balance
    const balanceAfter = await originalToken.balanceOf.call(founder);
    assert.equal(balanceAfter.toNumber(), cofounderDistribution);
  });

  it('should allow approval of expenditures on behalf of sender', async function () {
  
    const allowanceBefore = await originalToken.allowance.call(founder, cofounders[2]);

    await originalToken.approve(cofounders[2], 0);
    await originalToken.approve(cofounders[2], 3 * Math.pow(10, 9 + decimals));

    const allowanceAfter = await originalToken.allowance.call(founder, cofounders[2]);

    assert(allowanceBefore.toNumber() < allowanceAfter.toNumber(), 'allowance was not increased');
  });

  it('should allow transfer from an approved spender', async function () {
  
    await originalToken.approve(cofounders[2], 0);
    const allowanceBefore = await originalToken.allowance.call(founder, cofounders[2]);

    await originalToken.approve(cofounders[2], 3 * Math.pow(10, 9 + decimals));

    const allowanceAfter = await originalToken.allowance.call(founder, cofounders[2]);

    assert.equal(allowanceAfter.comparedTo(allowanceBefore), 1, 'allowance was not increased');

    await originalToken.transferFrom(founder, cofounders[4], 20000, { from: cofounders[2] });

    const allowanceAfterTransfer = await originalToken.allowance.call(founder, cofounders[2]);


    assert.equal(allowanceAfter.comparedTo(allowanceAfterTransfer), 1, 'allowance did not decrease');
  });

  it('supports ERC165', async function () {
    assert(await originalToken.supportsInterface.call('0x01ffc9a7'));
  });

  it('supports ERC20', async function () {
    assert(await originalToken.supportsInterface.call('0x36372b07'));
  });

  it('supports ERC20 with options', async function () {
    assert(await originalToken.supportsInterface.call('0x942e8b22'));
  });

  
  it('should have reasonable gas estimates', async function () {
    if (process.env.npm_lifecycle_event === 'cover' || process.env.SOLIDITY_COVERAGE){
      this.skip();
    } else {

      let estimateFor = {};

      estimateFor.transfer = await originalToken.transfer.estimateGas(cofounders[3], 2 * Math.pow(10, 5 + decimals));
      estimateFor.approve = await originalToken.approve.estimateGas(cofounders[2], 3 * Math.pow(10, 9 + decimals));

      await originalToken.approve.estimateGas(cofounders[2], 3 * Math.pow(10, 9 + decimals));

      estimateFor.transferFrom = await originalToken.transferFrom.estimateGas(founder, cofounders[5], 1 * Math.pow(10, 4 + decimals), { from: cofounders[2] });

      originalToken.transferFrom.estimateGas(founder, cofounders[5], 1 * Math.pow(10, 4 + decimals), { from: cofounders[2] });


      console.log(estimateFor);
    }
  });
 
});

async function reverts (p) {
  try {
    const result = await p;
    assert.fail('expected revert but ran to completion.');
  } catch (e) {
    const hasReverted = e.message.search(/revert/) > -1;
    assert(hasReverted, `expected revert but threw ${e}`);
  }
}

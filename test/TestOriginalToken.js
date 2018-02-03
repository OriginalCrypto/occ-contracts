const OriginalToken = artifacts.require('OriginalToken'),
      tokenName = 'Original Crypto Coin',
      tokenSymbol = 'OCC',
      AddressZero = '0x0000000000000000000000000000000000000000',
      decimals = 18;
      
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
      .new(cofounders, cofounderDistribution, { from: founder });
  });

  // TODO: revisit after implementing initial cofounder distribution
  it('should create an initial balance of 5.5 billion for a cofounder', async function ()  {
        let balance = await originalToken.balanceOf.call(cofounders[0]);
        assert.equal(balance.toNumber(), cofounderDistribution);
  });

  it('should give each cofounder an equal distribution', async function () {
    let instance = await  OriginalToken
      .new(cofounders, 2, { from: founder });

    let recordedCofounders = await instance.getCofounders.call();

    let balancesOfRecordedCofounders = [];
    recordedCofounders
      .filter(function (cofounder) { return cofounder !== founder; })
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
            .new(cofounders, 2, { from: founder });

    await reverts(instance.transfer(recipient, 3, { from: cofounders[0]}));
  });

  it('succeeds when transfering 0 tokens', async function () {
    const recipient = '0x347eD75c305f4ab85757Bfcc5600D9BfCb413898',
          result = await originalToken.transfer.call(recipient, 0, { from: founder });
    assert(result);
  });

  it('prevents token transfers to address(0)', async function () {
    try {
      await originalToken.transfer(AddressZero, 1, { from : cofounders[1] });
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
    const balanceBefore = await originalToken.balanceOf.call(cofounders[0]);

    assert.strictEqual(balanceBefore.toNumber(), cofounderDistribution);

    try {
      let result = await web3.eth.sendTransaction({
          from: cofounders[0],
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
    const balanceAfter = await originalToken.balanceOf.call(cofounders[0]);
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

    assert(allowanceAfter.gt(allowanceBefore), 'allowance was not increased');

    await originalToken.transferFrom(founder, cofounders[4], 20000, { from: cofounders[2] });

    const allowanceAfterTransfer = await originalToken.allowance.call(founder, cofounders[2]);


    assert(allowanceAfter.gt(allowanceAfterTransfer), 'allowance did not decrease');
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

  it('prevents a cofounder distribution greater than total supply', async function () {
    await reverts(OriginalToken.new(cofounders, OneHundredBillionPlusDecimals + 1));
  });

  it('prevents a cofounder distribution too big for the number of cofounders supplied', async function () {
    await reverts(OriginalToken.new(cofounders, OneHundredBillionPlusDecimals /2 ));
  });

  it('prevents transferFrom execution for amounts greater than approved', async function () {
    await originalToken.approve(cofounders[2], 0);
    await originalToken.approve(cofounders[2], 100);
    await reverts(originalToken.transferFrom(founder, cofounders[0], 101, { from: cofounders[2] }));
  });

  it('denies approval after partial withdrawal', async function () {
    await originalToken.approve(cofounders[2], 0);
    await originalToken.approve(cofounders[2], 100);

    await originalToken.transferFrom(founder, cofounders[0], 1, { from: cofounders[2] });

    await originalToken.approve(cofounders[2], 100);

    const allowanceAfterDenial = await originalToken.allowance.call(founder, cofounders[2]);

    console.log(allowanceAfterDenial.toNumber());
    assert(allowanceAfterDenial.eq(0), 'allowance should be zero after approval denial');
  });

  it('does not have address(0) cofounders even if passed into constructor', async function () {
    const instance = await OriginalToken.new([AddressZero, AddressZero, AddressZero, AddressZero], cofounderDistribution);

    const recordedCofounders = await instance.getCofounders.call();
    assert.ok(recordedCofounders.indexOf(AddressZero) == -1, 'address zero should not be added as a valid cofounder');
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

const OriginalToken = artifacts.require('OriginalToken'),
      tokenName = 'Original Crypto Coin',
      tokenSymbol = 'OCC',
      decimals = 18;
      
let   originalToken,
      founder,
      airdropCampaign,
      OneHundredBillionPlusDecimals = Math.pow(10,(11 + decimals)),
      cofounderDistribution = 55 * Math.pow(10, 8),
      cofounders;

async function reverts (p) {
  try {
    const result = await p;
    assert.fail('expected revert but ran to completion.');
  } catch (e) {
    const hasReverted = e.message.search(/revert/) > -1;
    assert(hasReverted, `expected revert but threw ${e}`);
  }
}

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

    let recordedCofounders = await instance
      .getCofounders
      .call();

    let distributionPromises = [];
    recordedCofounders
      .forEach(function (recordedCofounder) {
        distributionPromises.push(instance.balanceOf(recordedCofounder));
      });

    Promise
      .all(distributionPromises)
      .then(function (balancesOfRecordedCofounders) {
        assert.ok(
          balancesOfRecordedCofounders
            .every(function (distribution) { return distribution.toNumber() == 2; }));
      });
  });

  it('sets name, symbol, decimals and airdrop address correctly', async function () {

    const name = await originalToken.name.call();
    assert.strictEqual(name, 'Original Crypto Coin');

    const symbol = await originalToken.symbol.call();
    assert.strictEqual(symbol, 'OCC');

    const decimals = await originalToken.decimals.call();
    assert.equal(decimals.toNumber(), 18);

    const airdropCampaignAddress = await originalToken.airdropCampaign.call();
    assert.equal(airdropCampaignAddress, airdropCampaign);
  });

  it ('transfers tokens from one account to another', async function () {
    const recipient = '0x347eD75c305f4ab85757Bfcc5600D9BfCb413898';
    await originalToken.transfer(recipient, 10000, { from: cofounders[cofounders.length - 1] });
    
    const balance = await originalToken.balanceOf.call(recipient);
    assert.equal(balance.toNumber(), 10000);
  });

  it('prevents token transfers to address(0)', async function () {
      reverts(originalToken.transfer('0x0000000000000000000000000000000000000000', 1, { from : cofounders[1] }));
  });

  it('should not have token balance side effects during ether \'receive\' transaction', async function () {
    const balanceBefore = await originalToken.balanceOf.call(founder);
    assert
      .strictEqual(balanceBefore.toNumber(), cofounderDistribution);

    web3
      .eth
      .sendTransaction({
        from: founder,
        to: originalToken.address,
        value: web3.toWei('10', 'Ether')
      },
      async function (err, res) {
        reverts(new Promise(function (resolve, reject)  {
          if (err) reject(err);
          resolve(res);
        }));

        // sending ether should not have side affects on the token balance
        const balanceAfter = await originalToken.balanceOf.call(founder);
        assert.equal(balanceAfter.toNumber(), cofounderDistribution);
      });
  });

  it('should reject receiving ether', async function () {
    const balanceBefore = await web3.eth.getBalance(originalToken.address);
    assert.equal(balanceBefore.toNumber(), 0, `balance before: ${balanceBefore.toNumber()} should be zero`);

    web3
      .eth
      .sendTransaction({
        from: founder,
        to: originalToken.address,
        value: web3.toWei('10', 'Ether')
      },
      async function (err, res) {
        reverts(new Promise(function (resolve, reject)  {
          if (err) reject(err);
          resolve(res);
        }));

        const balanceAfter = await web3.eth.getBalance(originalToken.address);
        assert.equal(balanceAfter.toNumber(), 0, `balance after: ${balanceAfter.toNumber()} should be zero`);
      });
  });
});

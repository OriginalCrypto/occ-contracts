const OriginalToken = artifacts.require('OriginalToken'),
      tokenName = 'Original Crypto Coin',
      tokenSymbol = 'OCC',
      decimals = 18;

      
let   originalToken,
      founder,
      airdropCampaign,
      OneHundredBillionPlusDecimals = Math.pow(10,(11 + decimals)),
      cofounderDistribution = 55 * Math.pow(10, 8),
      cofounders,
      shouldThrow = async function (promise) {
        const assertMessage = 'Expected throw but ran to completion.',
              ethErrorMessages = ['invalid opcode', 'revert'];
        try {
          await promise;
        } catch (e) {
          const errorMessage = e.toString();
          console.log(errorMessage);
          assert(
            ethErrorMessages.some(function (ethErrorMessage) {
              return String.prototype.indexOf.call(errorMessage, ethErrorMessage) > -1;
            }),
            assertMessage);
          return;
        }
        assert.fail(assertMessage);
      };

contract('OriginalToken', function (accounts) {
  founder = accounts[0];
  airdropCampaign = accounts[1];
  cofounders = accounts.slice(2);

  before(async function () {
    originalToken = await OriginalToken.new(
      cofounders, airdropCampaign, 2000, tokenName, tokenSymbol, 2, 2, { from: founder });
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
        shouldThrow(new Promise(function (resolve, reject)  {
          if (err) reject(err);
          resolve(res);
        }));

          const balanceAfter = await web3.eth.getBalance(originalToken.address);
          assert.equal(balanceAfter.toNumber(), 0, `balance after: ${balanceAfter.toNumber()} should be zero`);
      });
  });

  it('should not have token balance side effects during ether \'receive\' transaction', async function () {
    const balanceBefore = await originalToken.balanceOf.call(founder);
    assert
      .strictEqual(balanceBefore.toNumber(), 2);

    web3
      .eth
      .sendTransaction({
        from: founder,
        to: originalToken.address,
        value: web3.toWei('10', 'Ether')
      },
      async function (err, res) {
        shouldThrow(new Promise(function (resolve, reject)  {
          if (err) reject(err);
          resolve(res);
        }));

          // sending ether should not have side affects on the token balance
          const balanceAfter = await originalToken.balanceOf.call(founder);
          assert.equal(balanceAfter.toNumber(), 2);
      });
  });
});

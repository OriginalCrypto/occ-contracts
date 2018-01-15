const OriginalToken = artifacts.require('OriginalToken'),
      tokenName = 'Original Crypto Coin',
      tokenSymbol = 'OCC',
      decimals = 18;
      
let   originalToken,
      founder,
      OneHundredBillionPlusDecimals = Math.pow(10,(11 + decimals)),
      cofounders;

contract('OriginalToken', function (accounts) {
    founder = accounts[0];
    cofounders = accounts.slice(1);


  // TODO: revisit after implementing initial cofounder distribution
  it('should create an initial balance of 100 billion for the creator', function ()  {
    return OriginalToken.
      new(cofounders, OneHundredBillionPlusDecimals, tokenName, tokenSymbol, decimals, { from: founder})
      .then(function (instance) {
        return instance.balanceOf.call(founder);
      })
      .then(function (balance) {
        console.log(balance);
        assert.strictEqual(OneHundredBillionPlusDecimals,balance.toNumber());

      });
  });


});

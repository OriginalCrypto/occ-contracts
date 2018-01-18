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

contract('OriginalToken', function (accounts) {
    founder = accounts[0];
    airdropCampaign = accounts[1];
    cofounders = accounts.slice(2);


  // TODO: revisit after implementing initial cofounder distribution
  it('should create an initial balance of 5.5 billion for the creator', function ()  {
    return OriginalToken
      .new(cofounders, airdropCampaign, OneHundredBillionPlusDecimals,
          tokenName, tokenSymbol, decimals, cofounderDistribution, { from: founder })
      .then(function (instance) {
        return instance.balanceOf.call(founder);
      })
      .then(function (balance) {
        assert.equal(balance.toNumber(), cofounderDistribution);

      });
  });

/*  it('should give each cofounder an equal distribution', function () {
    return OriginalToken
      .new(cofounders, airdropCampaign, 20, tokenName, tokenSymbol, 0, 1, { from: founder })
      .then(function (instance) {
        instance
          .getCofounders
          .call()
          .then(function (recordedCofounders) {
            let cofounderDistributions = [];
            recordedCofounders
              .forEach(function (recordedCofounder) {
                instance
                  .balanceOf(recordedCofounder)
                  .then(function (balanceOfRecordedCofounder) {
                    cofounderDistributions.push(balanceOfRecordedCofounder.toNumber());
                  });
              });
            assert.ok(cofounderDistributions.every(function (distribution) { return distribution == 1; }));
          });
      
        });
  });
  */
});

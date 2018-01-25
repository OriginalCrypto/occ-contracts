const OriginalToken = artifacts.require("./OriginalToken.sol"),
      secret = require('../.cofounders');

module.exports = function(deployer, network, accounts) {
    const airdropCampaign = secret.airdropCampaignAddress,
          cofounders = secret.cofounders,
          decimals = 18,
          tokenName = 'Original Crypto Coin',
          tokenSymbol = 'OCC',
          OneHundredBillionPlusDecimals = Math.pow(10, (11 + decimals)),
          cofounderDistribution = 55 * Math.pow(10, 8); // 5.5 billion

  deployer.deploy(OriginalToken, cofounders,
                    airdropCampaign, OneHundredBillionPlusDecimals,
                    tokenName, tokenSymbol, decimals, cofounderDistribution);

// TODO: why doesn't truffle's deployer pass arguments?

/*
  if (network !== 'development') {
    deployer.deploy(OriginalToken, cofounders,
                    airdropCampaign, OneHundredBillionPlusDecimals,
                    tokenName, tokenSymbol, decimals, cofounderDistribution,  { from: founder });
  }
*/
};


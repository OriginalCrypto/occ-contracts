const OriginalToken = artifacts.require("./OriginalToken.sol");

module.exports = function(deployer, network, accounts) {
    const founder = accounts[0],
          airdropCampaign = accounts[1],
          cofounders = accounts.slice(2),
          decimals = 18,
          tokenName = 'Original Crypto Coin',
          tokenSymbol = 'OCC',
          OneHundredBillionPlusDecimals = Math.pow(10, (11 + decimals)),
          cofounderDistribution = 55 * Math.pow(10, 8); // 5.5 billion

// TODO: why doesn't truffle's deployer pass arguments?

/*
  if (network !== 'development') {
    deployer.deploy(OriginalToken, cofounders,
                    airdropCampaign, OneHundredBillionPlusDecimals,
                    tokenName, tokenSymbol, decimals, cofounderDistribution,  { from: founder });
  }
*/
};


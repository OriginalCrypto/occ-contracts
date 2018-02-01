const OriginalToken = artifacts.require("./OriginalToken.sol");

let secret;
    

module.exports = function(deployer, network, accounts) {
  const shouldLoadSecrets = ['ropsten', 'rinkeby', 'kovan', 'main', 'infura'].indexOf(network) > 0;
  if (shouldLoadSecrets) {
    try {
      secret = require('../.cofounders');
    } catch (e) {
      // do not fallback to nonsensical values in production
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }
      
      secret = { cofounders: accounts.slice(2, 16),
        airdropCampaignAddress: accounts[1]
      };
    }
  } else {
      secret = { cofounders: accounts.slice(2, 16),
        airdropCampaignAddress: accounts[1]
      };
  }

  const airdropCampaign = secret.airdropCampaignAddress,
    cofounders = secret.cofounders,
    decimals = 18,
    tokenName = 'Original Crypto Coin',
    tokenSymbol = 'OCC',
    OneHundredBillionPlusDecimals = Math.pow(10, (11 + decimals)),
    cofounderDistribution = 55 * Math.pow(10, (8 + decimals)); // 5.5 billion

  deployer.deploy(OriginalToken, cofounders,
    airdropCampaign, OneHundredBillionPlusDecimals,
    tokenName, tokenSymbol, decimals, cofounderDistribution);
};


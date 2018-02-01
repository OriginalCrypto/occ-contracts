const OriginalToken = artifacts.require("./OriginalToken.sol");

let secret;
    

module.exports = function(deployer, network, accounts) {
  const shouldLoadSecrets = ['ropsten', 'rinkeby', 'kovan', 'main', 'infura'].indexOf(network) > -1;

  console.log(`network: ${network}\nshouldLoadSecrets: ${shouldLoadSecrets}`);
  if (shouldLoadSecrets) {
    try {
      secret = require('../.cofounders');
    } catch (e) {
      // do not fallback to nonsensical values in production
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }
      
      secret = { cofounders: accounts.slice(1, 15)
      };
    }
  } else {
      secret = { cofounders: accounts.slice(1, 15) };
  }

  const decimals = 18,
    cofounders = secret.cofounders,
    cofounderDistribution = 55 * Math.pow(10, (8 + decimals)); // 5.5 billion

  deployer.deploy(OriginalToken, cofounders, cofounderDistribution);
};


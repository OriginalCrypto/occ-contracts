var Cofounded = artifacts.require("./Cofounded.sol");

module.exports = function(deployer, network, accounts) {

  // the cofounded network is a base network
  // that doesn't really require deployment on live networks,
  // however, deployment is useful for testing scenarios
  if (network !== 'live') {
    var cofounders = accounts.slice(1);
    deployer.deploy(Cofounded, cofounders);
  }
};

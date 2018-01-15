var OriginalToken = artifacts.require("./OriginalToken.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(OriginalToken);
};

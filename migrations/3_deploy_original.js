const OriginalToken = artifacts.require("./OriginalToken.sol");

module.exports = function(deployer, network, accounts) {
    const founder = accounts[0],
          cofounders = accounts.slice(1),
          decimals = 18,
          tokenName = 'Original Crypto Coin',
          tokenSymbol = 'OCC',
          OneHundredBillionPlusDecimals = Math.pow(10, (11 + decimals));

    deployer.deploy(OriginalToken, cofounders, OneHundredBillionPlusDecimals, tokenName, tokenSymbol);
};

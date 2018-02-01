const AirdropCampaign = artifacts.require('AirdropCampaign'),
      OriginalToken   = artifacts.require('OriginalToken');

let secret;
    

module.exports = function(deployer, network, accounts) {
  const decimals = 18,
    addressZero = '0x0000000000000000000000000000000000000000',
    disbursementAmount  = 2 * Math.pow(10, (5 + decimals)); // 200,000 

  deployer.deploy(AirdropCampaign, OriginalToken.address, addressZero, disbursementAmount);
};


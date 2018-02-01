const AirdropCampaign = artifacts.require('AirdropCampaign'),
      OriginalToken   = artifacts.require('OriginalToken');

let secret;
    

module.exports = function(deployer, network, accounts) {
  const shouldLoadSecrets = ['ropsten', 'rinkeby', 'kovan', 'main', 'infura'].indexOf(network) > 0,
    decimals = 18,
    addressZero = '0x0000000000000000000000000000000000000000',
    disbursementAmount  = 2 * Math.pow(10, (5 + decimals)); // 200,000 

  deployer.deploy(AirdropCampaign, OriginalToken.address, addressZero, disbursementAmount);
/*

  if (shouldLoadSecrets) {
    try {
      secret = require('../.cofounders');
    } catch (e) {
      // do not fallback to nonsensical values in production
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }

      deployer.deploy(AirdropCampaign, OriginalToken.address, addressZero, disbursementAmount);
    }

    deployer.deploy(AirdropCampaign, OriginalToken.address, addressZero, disbursementAmount);

  } else {
    secret = { airdropCampaignAddress: accounts[1] };

    let airdrop, token;
          

    deployer.then(function() {
      console.log('creating airdrop');
      return AirdropCampaign.new(OriginalToken.address, addressZero, disbursementAmount);
    })
    .then(function (instance) {
      console.log('created airdrop');
      airdrop = instance;
      return OriginalToken.deployed();
    })
    .then(function (instance) {
      token = instance;

      console.log('getting balance');
      return token.balanceOf.call(secret.airdropCampaignAddress)
      .then(function (airdropBalance) {
        console.log('got balance:' + airdropBalance.toNumber());
        console.log('approving airdrop');
        return token.approve(AirdropCampaign.address, airdropBalance, { from: secret.airdropCampaignAddress });
      })
      .then(function () {
        console.log('approved');
        return token.allowance.call(secret.airdropCampaignAddress, AirdropCampaign.address);
      })
      .then(function (allowanceAmount) {
        console.log('allowanceAmount: ' + allowanceAmount.toNumber());
        console.log('setting token holder on airdrop');
        return airdrop.setTokenHolderAddress(secret.airdropCampaignAddress);
      })
      
      .catch(function (e) { console.log(e); });
    });
  }
*/
};


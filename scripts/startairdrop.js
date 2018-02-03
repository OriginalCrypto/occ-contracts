const decimals = 18,
      OriginalToken = artifacts.require('OriginalToken'),
      AirdropCampaign = artifacts.require('AirdropCampaign'),
      AddressZero ='0x0000000000000000000000000000000000000000',
      CapmaignTotal = 61 * Math.pow(10, (9 + decimals));



module.exports = async function (callback) {
  const getAccounts = async function () {
    const p = new Promise(function (resolve, reject) {
      try {
        web3.eth.getAccounts(function (error, accounts) {
          if (error) {
            reject(error);
          } else {
            resolve(accounts);
          }
        });
      } catch (e) {
        reject(e);
      }
    });

    return p;
  };

  const accounts = await getAccounts(),
        founder = accounts[0],
        originalToken = await OriginalToken.deployed();
        airdrop = await AirdropCampaign.deployed(),
        balanceOf = await originalToken.balanceOf.call(founder);

  await originalToken.approve(airdrop.address, CapmaignTotal, { from: founder });
  await airdrop.setTokenHolderAddress(founder);

  const tokenHolder = await airdrop.tokenHolderAddress.call(),
        allowance = await originalToken.allowance.call(founder, airdrop.address);

  console.log(`founder: ${founder}`);
  console.log(`allowance: ${allowance.toNumber() * Math.pow(10, -1 * (9 + decimals))}`);
  console.log(`balanceOf: ${balanceOf.toNumber() * Math.pow(10, -1 * (9 + decimals))}`);
  console.log(`holder: ${tokenHolder}`);
  

  callback();
};



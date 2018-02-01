const OriginalToken = artifacts.require('OriginalToken'),
      decimals = 18,
      AirdropCampaign = artifacts.require('AirdropCampaign'),
      addressZero ='0x0000000000000000000000000000000000000000',
      disbursementAmount = 2 * Math.pow(10, (5 + decimals)); // 200,000
      
let   originalToken,
      airdrop;

contract('AirdropCampaign', function (accounts) {
  founder = accounts[0];
  airdropCampaign = accounts[1];
  cofounders = accounts.slice(2, 16);

  before(async function () {
    originalToken = await OriginalToken
      .deployed();

    airdrop = await AirdropCampaign.new(originalToken.address, addressZero, disbursementAmount);
  });

  it('should prevent multiple disbursements to a single account when canDisburseMultipleTimes is false', async function (){
   const instance = await AirdropCampaign.new(originalToken.address, addressZero, disbursementAmount);   
    await originalToken.approve(instance.address, 400000 * Math.pow(10, decimals), { from: founder });
    await instance.setTokenHolderAddress(founder);
    await instance.register({ from: accounts[2] });

    await reverts(instance.register({ from: accounts[2] }));
  });
});

async function reverts (p) {
  try {
    const result = await p;
    assert.fail('expected revert but ran to completion.');
  } catch (e) {
    const hasReverted = e.message.search(/revert/) > -1;
    assert(hasReverted, `expected revert but threw ${e}`);
  }
}

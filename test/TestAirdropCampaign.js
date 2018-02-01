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

  // TODO: revisit after implementing initial cofounder distribution
  it('should have reasonable gas estimates', async function () {
    if (process.env.npm_lifecycle_event === 'cover' || process.env.SOLIDITY_COVERAGE){
      this.skip();
    } else {
      let estimateFor = {};
      
      estimateFor.setTokenAddress = await airdrop.setTokenAddress.estimateGas(OriginalToken.address);
      estimateFor.setDisbursementAmount = await airdrop.setDisbursementAmount.estimateGas(disbursementAmount * 2);
      estimateFor.setCanDisburseMultipleTimes = await airdrop.setCanDisburseMultipleTimes.estimateGas(true);

      await airdrop.setCanDisburseMultipleTimes(true);

      const balance = await originalToken.balanceOf.call(airdropCampaign);

      const approved = await originalToken.approve(airdrop.address, balance, { from: airdropCampaign });
      estimateFor.setTokenHolderAddress = await airdrop.setTokenHolderAddress.estimateGas(airdropCampaign);


      await airdrop.setTokenHolderAddress(airdropCampaign);

      estimateFor.register = await airdrop.register.estimateGas({ from: founder });

      console.log(estimateFor);

      assert(estimateFor.setTokenAddress < 31700, 'setTokenAddress too costly');
      assert(estimateFor.setDisbursementAmount < 27380, 'setDisbursementAmount too costly');
      assert(estimateFor.setCanDisburseMultipleTimes < 42355, 'setCanDisburseMultipleTimes too costly');
      assert(estimateFor.setTokenHolderAddress < 49000, 'setTokenHolderAddress too costly');
      assert(estimateFor.register < 84100, 'register too costly');
    }
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

const OriginalToken = artifacts.require('OriginalToken'),
      decimals = 18,
      AirdropCampaign = artifacts.require('AirdropCampaign'),
      disbursementAmount = 2 * Math.pow(10, (5 + decimals)); // 200,000
      
let   originalToken,
      airdrop;

contract('Gas Estimates', function (accounts) {
  console.log(accounts);
  founder = accounts[0];
  cofounders = accounts.slice(1, 15);

  before(async function () {
    originalToken = await OriginalToken
      .deployed();

    airdrop = await AirdropCampaign.deployed();
  });

  // TODO: revisit after implementing initial cofounder distribution
  it('airdrop should have reasonable gas estimates', async function () {
    if (process.env.npm_lifecycle_event === 'cover' || process.env.SOLIDITY_COVERAGE){
      this.skip();
    } else {
      let estimateFor = {};
      

      estimateFor.setTokenAddress = await airdrop.setTokenAddress.estimateGas(OriginalToken.address);
      estimateFor.setDisbursementAmount = await airdrop.setDisbursementAmount.estimateGas(disbursementAmount * 2);
      estimateFor.setCanDisburseMultipleTimes = await airdrop.setCanDisburseMultipleTimes.estimateGas(true);

      await airdrop.setCanDisburseMultipleTimes(true);

      const balance = await originalToken.balanceOf.call(founder);

      const approved = await originalToken.approve(airdrop.address, balance, { from: founder});
      estimateFor.setTokenHolderAddress = await airdrop.setTokenHolderAddress.estimateGas(founder);


      await airdrop.setTokenHolderAddress(founder);

      estimateFor.register = await airdrop.register.estimateGas({ from: accounts[3]});

      console.log(estimateFor);
      assert(estimateFor.setTokenAddress < 31700, 'setTokenAddress too costly');
      assert(estimateFor.setDisbursementAmount < 27380, 'setDisbursementAmount too costly');
      assert(estimateFor.setCanDisburseMultipleTimes < 42355, 'setCanDisburseMultipleTimes too costly');
      assert(estimateFor.setTokenHolderAddress < 49000, 'setTokenHolderAddress too costly');
      assert(estimateFor.register < 99968, 'register too costly');
    }
  });

  it('token should have reasonable gas estimates', async function () {
    if (process.env.npm_lifecycle_event === 'cover' || process.env.SOLIDITY_COVERAGE){
      this.skip();
    } else {

      let estimateFor = {};

      estimateFor.transfer = await originalToken.transfer.estimateGas(cofounders[3], 2 * Math.pow(10, 5 + decimals), { from: cofounders[4] });
      estimateFor.approve = await originalToken.approve.estimateGas(cofounders[2], 3 * Math.pow(10, 9 + decimals), { from: founder });

      await originalToken.approve(cofounders[2], 3 * Math.pow(10, 9 + decimals));

      estimateFor.transferFrom = await originalToken.transferFrom.estimateGas(
        founder, cofounders[5], 1 * Math.pow(10, 4 + decimals), { from: cofounders[2] });

      console.log(estimateFor);
      assert(estimateFor.transfer < 37000, 'transfer too costly');
      assert(estimateFor.approve < 50000, 'approve too costly');
      assert(estimateFor.transferFrom < 70000, 'transferFrom too costly');
    }
  });
});


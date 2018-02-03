const TestCofoundedRestricted = artifacts.require('TestCofoundedRestricted'),
      AddressZero = '0x0000000000000000000000000000000000000000';

contract('TestCofoundedRestricted', function (accounts) {
  let cofounders = accounts.slice(1, 14),
      founder    = accounts[0];

  it('prevents non-cofounders from calling restricted functions', async function () {
    const testContract = await TestCofoundedRestricted.new(cofounders.slice(0,2), { from:  founder });
    const valueBefore = await testContract.restrictedProperty.call();

    await reverts(testContract.setRestrictedProperty(1, { from: cofounders[5] }));
    const valueAfter  = await testContract.restrictedProperty.call();

    assert.equal(valueBefore.toNumber(), valueAfter.toNumber());
  });

  it('allows cofounders to call restricted functions', async function () {
    const cofoundersSubset = cofounders.slice(0,2);
    const testContract = await TestCofoundedRestricted.new(cofoundersSubset, { from:  founder });
    const valueBefore = await testContract.restrictedProperty.call();

    await testContract.setRestrictedProperty(1, { from: cofoundersSubset[0] });
    const valueAfter  = await testContract.restrictedProperty.call();

    assert.notEqual(valueBefore.toNumber(), valueAfter.toNumber());
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


const Cofounded = artifacts.require('Cofounded'),
      TestCofoundedRestricted = artifacts.require('TestCofoundedRestricted');

contract('Cofounded', function (accounts) {
  let cofounders = accounts.slice(1, 14),
      founder    = accounts[0];

  it('can be created with multiple cofounders', async function () {
    let  cofounded,
         expectedCofounders = cofounders.concat([founder]);

    cofounded = await Cofounded.new(cofounders, { from: founder});

    const recordedCofounders = await cofounded.getCofounders.call();

    assert.ok(recordedCofounders.indexOf(founder) > -1, 'founder was not included in recorded cofounders');
    assert.equal(recordedCofounders.length, expectedCofounders.length, 'too few cofounders added to contract');
    
    cofounders.forEach(function(cofounder){
      assert.ok(recordedCofounders.indexOf(cofounder) > -1,
        'cofounder ' + cofounder + ' was not included in recorded cofounders');
    });
  }); 

  it('will not add duplicate cofounders', async function () {
    let duplicate  = cofounders[3],
        // NOTE: adding 3 more of an existing address
        cofoundersPlusDuplicates = cofounders.concat([duplicate ,duplicate, duplicate]),
        cofounded = await Cofounded.new(cofoundersPlusDuplicates, { from: founder}),
        recordedCofounders;

    recordedCofounders = await cofounded.getCofounders.call();

    var foundCount = 0;

    recordedCofounders.forEach(function(cofounder){
      if (cofounder == duplicate) foundCount++;
    });

    assert.equal(foundCount, 1, "duplicates found");
  });

  it('returns a list of cofounders with the correct number of cofounders', async function () {
    let expectedCofounders = cofounders.concat([founder]),
        cofounded = await Cofounded.new(cofounders, { from: founder }),
        recordedCofounders = await cofounded.getCofounders.call();

    assert.equal(recordedCofounders.length, expectedCofounders.length);
  });

  it('returns the correct number of cofounders', async function () {
    let expectedCofounders = cofounders.concat([founder]),
        cofounded = await Cofounded.new(cofounders, { from: founder }),
        recordedNumberOfCofounders = await cofounded.getCofounderCount.call();

    assert.equal(recordedNumberOfCofounders.toNumber(), expectedCofounders.length);
  });

  it('prevents non-cofounders from calling restricted functions', async function () {
    const testContract = await TestCofoundedRestricted.new(cofounders.slice(0,2), { from:  founder });
    const valueBefore = await testContract.restrictedProperty.call();

    reverts(testContract.setRestrictedProperty(1, { from: accounts[3] }));
    const valueAfter  = await testContract.restrictedProperty.call();

    assert.equal(valueBefore.toNumber(), valueAfter.toNumber());
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


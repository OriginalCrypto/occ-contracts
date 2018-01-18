const Cofounded = artifacts.require('Cofounded');
contract('Cofounded', function (accounts) {
  let cofounders = accounts.slice(1),
      founder    = accounts[0];

  it('can be created with multiple cofounders', function () {
    let  cofounded;

    return Cofounded
      .new(cofounders, { from: founder})
      .then(function (instance) {
        cofounded = instance;
        return cofounded.getCofounders.call();
      })
      .then(function (recordedCofounders) {
        assert.ok(recordedCofounders.indexOf(founder) > -1, 'founder was not included in recorded cofounders');
        assert.equal(accounts.length, recordedCofounders.length, 'too few cofounders added to contract');
        cofounders.forEach(function(cofounder){
          assert.ok(recordedCofounders.indexOf(cofounder) > -1,
            'cofounder ' + cofounder + ' was not included in recorded cofounders');
        });
      });
  }); 

  it('will not add duplicate cofounders', function () {
    var cofounders = accounts.slice(1),
        founder    = accounts[0],
        duplicate  = '0x627306090abab3a6e1400e9345bc60c78a8bef57',
        cofounded;

    // NOTE: adding 2 more of an existing address
    cofounders.push(duplicate ,duplicate, duplicate);

    return Cofounded
      .new(cofounders, { from: founder})
      .then(function (instance) {
        cofounded = instance;
        return cofounded.getCofounders.call();
      })
      .then(function (recordedCofounders) {
        var foundCount = 0;
        recordedCofounders.forEach(function(cofounder){
          if (cofounder == duplicate) foundCount++;
        });

        assert.equal(foundCount, 1, "duplicates found");
      });
  });

  it('returns a list of cofounders with the correct number of cofounders', function () {
    return Cofounded 
      .new(cofounders, { from: founder })
      .then(function (instance) {
        let expectedCofounders = cofounders.concat([founder]);
        instance
          .getCofounders
          .call()
          .then(function (recordedCofounders) {
            assert.strictEqual(recordedCofounders.length, expectedCofounders.length);
          });
      });
  });

  it('returns the correct number of cofounders', function () {
    return Cofounded 
      .new(cofounders, { from: founder })
      .then(function (instance) {
        let expectedCofounders = cofounders.concat([founder]);
        instance
          .getCofounderCount
          .call()
          .then(function (recordedNumberOfCofounders) {
            assert.strictEqual(recordedNumberOfCofounders, expectedCofounders.length);
          });
      });
  });
  
});

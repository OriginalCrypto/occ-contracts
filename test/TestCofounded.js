var Cofounded = artifacts.require('Cofounded');

contract('Cofounded', function (accounts) {
  it('can be created with multiple cofounders', function () {
    var cofounders = accounts.slice(1),
        founder    = accounts[0],
        cofounded;
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
          assert.ok(recordedCofounders.indexOf(cofounder) > -1, 'cofounder ' + cofounder + ' was not included in recorded cofounders');
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

  
});

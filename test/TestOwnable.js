const Ownable = artifacts.require('Ownable');
  let ownable,
      ownerBefore,
      ownerAfter;
      

async function reverts (p) {
  try {
    const result = await p;
    console.log(result);
    assert.fail('expected revert but ran to completion.');
  } catch (e) {
    console.log(e);
    const hasReverted = e.message.search(/revert/) > -1;
    assert(hasReverted, `expected revert but threw ${e}`);
  }
}

contract('Ownable', function (accounts) {
  const ownerCandidate = accounts[1];

  beforeEach(async function () {
    ownable = await Ownable.new();
    ownerBefore = await ownable.owner();
  });

  it('allows the owner to change ownership', async function () {

    assert.equal(ownerBefore, accounts[0]);

    await ownable.setOwner(ownerCandidate);

    ownerAfter = await ownable.owner();

    assert.equal(ownerCandidate, ownerAfter);
  });

  it('prevents non-owners from making ownership changes', async function () {
    assert.equal(ownerBefore, accounts[0]);

    reverts(ownable.setOwner(ownerCandidate, { from: accounts[2] }));
    ownerAfter = await ownable.owner();
    assert.equal(ownerBefore, ownerAfter);
  });

});

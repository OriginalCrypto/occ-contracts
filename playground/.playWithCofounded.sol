pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Cofounded.sol";

// NOTE: a little complex but reading
// http://truffleframework.com/tutorials/testing-for-throws-in-solidity-tests#testing-for-throws-in-truffle-solidity-tests
// should clear it up.
// CoFoundedFactory should bomb and our solidity tests wouldn't just fail, they'd error out
// but using a factory (and a proxy) will let us get a true/false as to whether an exception was thrown
contract CofoundedFactory {

  /// @dev tests that Cofounded can be created with 15 or fewer 
  /// addresses but will fail on 16 or more
  function createCofounded (address[20] cofounders) public returns (address) {
    return new Cofounded(address[14](cofounders));
  }
}

contract FactoryProxy {
  address public factory;
  bytes public data;

  function FactoryProxy (address _factory) public {
    factory = _factory;
  }

  // fallback function is called when the function signature doesn't match an existing function
  function () public {
    data = msg.data;
  }

  function execute () public returns (bool) {
    return factory.call(data);
  }
}


// Don't prepend Test if you don't want this test run
contract PlayWithCofounded {
  function CannotCreateWithTooManyCofounders() public {
    address[20] memory tooManyCofounders = [
      0x627306090abaB3A6e1400e9345bC60c78a8BEf57,
      0xf17f52151EbEF6C7334FAD080c5704D77216b732,
      0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef,
      0x821aEa9a577a9b44299B9c15c88cf3087F3b5544,
      0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2,

      0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e,
      0x2191eF87E392377ec08E7c08Eb105Ef5448eCED5,
      0x0F4F2Ac550A1b4e2280d04c21cEa7EBD822934b5,
      0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc,
      0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE,

      0x05EE546c1a62f90D7aCBfFd6d846c9C54C7cF94c,
      0xE05390Fc8295f4D3F60332c93bEd42e2f230B790,
      0xfc8295Ff230b7904d3F60332C93BEd42e2e05390,
      0x230B79fFC8295F4D3F60e053900332c93BEd42e2,
      0x90E0539f230b70fc8295f4d3F60332C93bed42e2,

      0xBeD42E2f230b790E05390FC8295F4D3f60332C93,
      0x469B32A511d40AF627D994c76284d0F508c96e6d,
      0x1A6017B0b15fb4d29dE2807096c36c2C28a85Dbb,
      0x8d12A197cB00D4747a1fe03395095ce2A5CC6819,
      0x423832DD4476D6DBef1fE910E23B56cA367f2d17];

      CofoundedFactory cofoundedFactory = new CofoundedFactory();
      FactoryProxy factoryProxy = new FactoryProxy(address(cofoundedFactory));

      // executing a factory function at the proxy address (which lacks the function in question) will call the fallback function
      CofoundedFactory(address(factoryProxy)).createCofounded(tooManyCofounders);

      bool result = factoryProxy.execute.gas(300000)();

      Assert.isFalse(result, 'Should be false, as the subcall should throw');
  }
}

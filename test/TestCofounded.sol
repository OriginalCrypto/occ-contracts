pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Cofounded.sol";

contract TestCofounded {
  Cofounded cofounded = Cofounded(DeployedAddresses.Cofounded());
  function testCreateWithMultipleCofounders() public {
  }

  function testFailToCreateWIthTooManyCofounders() public {
  }

  function testCreatesCofoundersOnlyWithValidAddresses() public {
  }
}

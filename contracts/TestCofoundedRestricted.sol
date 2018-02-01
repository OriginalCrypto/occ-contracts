pragma solidity ^0.4.17;

import './Cofounded.sol'; 

contract TestCofoundedRestricted is Cofounded {
  uint8 public restrictedProperty;

  function TestCofoundedRestricted (address[] contractCofounders) Cofounded(contractCofounders) public { }

  function setRestrictedProperty (uint8 value) public restricted {
    restrictedProperty = value;
  }
}


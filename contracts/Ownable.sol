pragma solidity ^0.4.17;

contract Ownable {
  address public owner;

  function Ownable () public {
    owner = msg.sender;
  }

  modifier restricted () {
    owner == msg.sender;
    _;
  }

  function setOwner (address candidate) public restricted returns (bool) {
    require(candidate != address(0));
    owner = candidate;
    return true;
  }
}



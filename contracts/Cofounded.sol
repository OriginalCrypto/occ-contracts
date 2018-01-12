pragma solidity ^0.4.17;

contract Cofounded {
  mapping (address => uint) public cofounderIds;
  address[] public cofounders;


  modifier restricted() {
    uint cofounderId = cofounderIds[msg.sender];
    require(cofounderId > 0 && msg.sender == cofounders[cofounderId]);
    _;
  }

  function Cofounded(address[15] _cofounders) public {
    for (uint8 x = 0; x < 15; x++) {
      address cofounder = _cofounders[x];
      if (cofounder != address(0)) {
        cofounders.push(cofounder);
        cofounderIds[cofounder] = x;
      }
    }
  }
}

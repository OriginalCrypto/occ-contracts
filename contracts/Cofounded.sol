pragma solidity ^0.4.17;

/// @title a non-multisignature contract with many founders/owners
/// @author Mish Ochu
contract Cofounded {
  mapping (address => uint) public cofounderIndices;
  address[] public cofounders;


  /// @dev restrict execution to one of original cofounder addresses
  modifier restricted () {
    uint cofounderIndex = cofounderIndices[msg.sender];
    require(msg.sender == cofounders[cofounderIndex]);
    _;
  }

  /// @notice creates the Cofounded contract instance
  /// @dev adds up to cofounders.
  ///      also adds  the deployment address as a cofounder
  function Cofounded (address[] contractCofounders) public {
    cofounders.push(msg.sender);
    
    for (uint8 x = 0; x < contractCofounders.length; x++) {
      address cofounder = contractCofounders[x];

      bool isValidUniqueCofounder =
        cofounder != address(0) &&
        cofounder != msg.sender &&
        cofounderIndices[cofounder] == 0;

            
      // NOTE: solidity as of 0.4.20 does not have an
      // undefined or null-like value
      // thusly mappings return the default value of the value type
      // for an unregistered key value
      // an address which doesn't exist will return 0
      // which is actually the index of the address of the first
      // cofounder
      if (isValidUniqueCofounder) {
        uint256 cofounderIndex = cofounders.push(cofounder) - 1;
        cofounderIndices[cofounder] = cofounderIndex;
      }
    }
  }

  /// @dev get count of cofounders
  function getCofounderCount () public constant returns (uint256) {
    return cofounders.length;
  }

  /// @dev get list of cofounders
  function getCofounders () public constant returns (address[]) {
    return cofounders;
  }
}

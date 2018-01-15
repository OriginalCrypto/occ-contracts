pragma solidity ^0.4.17;

/// @title a non-multisignature contract with many founders/owners
/// @author Mish Ochu
contract Cofounded {
  mapping (address => uint) public cofounderIds;
  address public founder;
  address[] public cofounders;
  uint8 public constant MAX_COFOUNDERS = 15;


  /// @dev restrict execution to one of original cofounder addresses
  modifier restricted () {
    uint cofounderId = cofounderIds[msg.sender];
    require(msg.sender == cofounders[cofounderId]);
    _;
  }

  /// @notice creates the Cofounded contract instance
  /// @dev adds up to (MAX_COFOUNDERS) cofounders.
  ///      also adds  the deployment address as a founder (a special variable)
  ///      and as a cofounder
  function Cofounded (address[] tokenCofounders) public {
    cofounders.push(founder = msg.sender);
    
    for (uint8 x = 0; x < MAX_COFOUNDERS; x++) {
      address cofounder = tokenCofounders[x];

      bool isValidUniqueCofounder =
        cofounder != address(0) &&
        cofounder != founder &&
        cofounderIds[cofounder] == 0;

            
      // NOTE: solidity as of 0.4.20 does not have an
      // undefined or null-like value
      // thusly mappings return the default value of the value type
      // for an unregistered key value
      // an address which doesn't exist will return 0
      // which is actually the index of the address of the first
      // cofounder (the founder)
      if (isValidUniqueCofounder) {
        uint256 cofounderId = cofounders.push(cofounder) - 1;
        cofounderIds[cofounder] = cofounderId;
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

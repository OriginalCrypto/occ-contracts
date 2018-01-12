pragma solidity ^0.4.17;

/// @title a contract interface of the ERC-20 token standard
/// @author Mish Ochu

/// @dev Ref: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
contract ERC20 {
  // Required methods
  function totalSupply() public view returns (uint256 total);
  function balanceOf(address owner) public view returns (uint256 balance);
  // Events

}

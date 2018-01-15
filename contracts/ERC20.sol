pragma solidity ^0.4.17;

/// @title a contract interface of the ERC-20 token standard
/// @author Mish Ochu
/// @dev Ref: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
interface ERC20 {

  // Required methods
  function transfer (address to, uint256 value) public returns (bool success);
  function transferFrom (address from, address to, uint256 value) public returns (bool success);
  function approve (address spender, uint256 value) public returns (bool success);
  function allowance (address owner, address spender) public constant returns (uint256 remaining);
  function balanceOf (address owner) public constant returns (uint256 balance);
  // Events
  event Transfer (address indexed from, address indexed to, uint256 value);
  event Approval (address indexed owner, address indexed spender, uint256 value);
}

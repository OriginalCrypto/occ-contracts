pragma solidity ^0.4.17;

/// @title a contract interface of the ERC-20 token standard
/// @author Mish Ochu
/// @dev Ref: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
contract ERC20 {
  string public constant  name;
  string public constant symbol;
  uint8 public constant decimals;
  uint256 public constant totalSupply;
  mapping (address => uint256) public balanceOf;
  function transfer (address to, uint256 value) returns (bool success);
  function transferFrom(address _from, address _to, uint256 _value) returns (bool success)
  function approve(address _spender, uint256 _value) returns (bool success)
  function allowance(address _owner, address _spender) constant returns (uint256 remaining)
  // Required methods
  function totalSupply() public view returns (uint256 total);
  function balanceOf(address owner) public view returns (uint256 balance);
  // Events
  event Transfer(address indexed _from, address indexed _to, uint256 _value)
  event Approval(address indexed _owner, address indexed _spender, uint256 _value)

}

pragma solidity ^0.4.17;

contract InterfaceSignatureConstants {
  bytes4 constant InterfaceSignature_ERC165 =
    bytes4(keccak256('supportsInterface(bytes4)'));

  bytes4 constant InterfaceSignature_ERC20 =
    bytes4(keccak256('totalSupply()')) ^
    bytes4(keccak256('balanceOf(address)')) ^
    bytes4(keccak256('transfer(address,uint256)')) ^
    bytes4(keccak256('transferFrom(address,address,uint256)')) ^
    bytes4(keccak256('approve(address,uint256)')) ^
    bytes4(keccak256('allowance(address,address)'));

  bytes4 constant InterfaceSignature_ERC20_PlusOptions = 
    bytes4(keccak256('name()')) ^
    bytes4(keccak256('symbol()')) ^
    bytes4(keccak256('decimals()')) ^
    bytes4(keccak256('totalSupply()')) ^
    bytes4(keccak256('balanceOf(address)')) ^
    bytes4(keccak256('transfer(address,uint256)')) ^
    bytes4(keccak256('transferFrom(address,address,uint256)')) ^
    bytes4(keccak256('approve(address,uint256)')) ^
    bytes4(keccak256('allowance(address,address)'));
}

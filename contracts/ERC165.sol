pragma solidity ^0.4.17;

/// @title Interface for contracts conforming to ERC-165: Pseudo-Introspection, or standard interface detection
/// @author Mish Ochu
interface ERC165 {
  /// @dev true iff the interface is supported
  function supportsInterface(bytes4 interfaceID) external constant returns (bool);
}


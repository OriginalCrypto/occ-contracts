pragma solidity ^0.4.17;

import './ERC20.sol';
import './ERC165.sol';
import './Ownable.sol';
import './InterfaceSignatureConstants.sol';

contract AirdropCampaign is Ownable, InterfaceSignatureConstants {
  address public tokenAddress;
  uint256 public disbursementAmount;

  mapping (address => uint256) disbursements;

  function AirdropCampaign (address tokenContract, uint256 amount) Ownable() public {
    // allow for not supplying the constructor with a working token
    // and updating it later, however, if an address is supplied make
    // sure it conforms to our token requirements
    if (tokenContract != address(0)) {
      setTokenAddress(tokenContract);
    }

    disbursementAmount = amount;
  }

  function register () public returns (bool) {
    ERC20 tokenContract = ERC20(tokenAddress);

    require(tokenContract.balanceOf(this) > disbursementAmount);

    tokenContract.transfer(msg.sender, disbursementAmount);
  }

  function setTokenAddress (address candidate) public restricted returns (bool) {
    ERC165 candidateContract = ERC165(candidate);

    // roundabout way of verifying this
    // 1. this address must have the code for 'supportsInterface' (ERC165), and,
    // 2. this address must return true given the hash of the interface for ERC20
    require(candidateContract.supportsInterface(InterfaceSignature_ERC20));
    tokenAddress = candidateContract;
    return true;
  }

  function setDisbursementAmount (uint256 amount) public restricted returns (bool) {
    require(amount > 0);
    disbursementAmount = amount;
    return true;
  }
}

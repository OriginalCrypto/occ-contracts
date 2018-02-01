pragma solidity ^0.4.17;

import './ERC20.sol';
import './ERC165.sol';
import './Ownable.sol';
import './InterfaceSignatureConstants.sol';

contract AirdropCampaign is Ownable, InterfaceSignatureConstants {
  address public tokenAddress;
  address public tokenHolderAddress;
  uint256 public disbursementAmount;
  bool    public canDisburseMultipleTimes;

  mapping (address => uint256) public disbursements;

  function AirdropCampaign (address tokenContract, address tokenHolder, uint256 amount) Ownable() public {
    // allow for not supplying the constructor with a working token
    // and updating it later, however, if an address is supplied make
    // sure it conforms to our token requirements
    if (tokenContract != address(0)) {
      setTokenAddress(tokenContract);
    }

    if (tokenHolder != address(0)) {
      setTokenHolderAddress(tokenHolder);
    }

    setDisbursementAmount(amount);
  }

  function register () public returns (bool) {
    if (!(canDisburseMultipleTimes ||
        disbursements[msg.sender] == uint256(0))) revert();

    ERC20 tokenContract = ERC20(tokenAddress);

    disbursements[msg.sender] += disbursementAmount;
    return tokenContract.transferFrom(tokenHolderAddress, msg.sender, disbursementAmount);
  }

  function setTokenAddress (address candidate) public restricted {
    ERC165 candidateContract = ERC165(candidate);

    // roundabout way of verifying this
    // 1. this address must have the code for 'supportsInterface' (ERC165), and,
    // 2. this address must return true given the hash of the interface for ERC20
    if (!candidateContract.supportsInterface(InterfaceSignature_ERC20)) revert();
    tokenAddress = candidateContract;
  }

  function setDisbursementAmount (uint256 amount) public restricted {
    if (amount == 0) revert();
    disbursementAmount = amount;
  }

  function setCanDisburseMultipleTimes (bool value) public restricted {
    canDisburseMultipleTimes = value;
  }

  function setTokenHolderAddress(address holder) public restricted {
    ERC20 tokenContract = ERC20(tokenAddress);
    if (tokenContract.balanceOf(holder) == 0) revert();
    if (tokenContract.allowance(holder, address(this)) == 0) revert();
    tokenHolderAddress = holder;
  }
}

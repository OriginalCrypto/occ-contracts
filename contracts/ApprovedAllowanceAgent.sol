pragma solidity ^0.4.17;

interface ApprovedAllowanceAgent {
  function receiveApproval (address from, uint256 value, address token, bytes extraData) public;
}


pragma solidity ^0.4.17;

import './Cofounded.sol';
import './ERC20.sol';
import './ERC165.sol';
import './ApprovedAllowanceAgent.sol';

/// @title an original cofounder based ERC-20 compliant token
/// @author Mish Ochu
/// @dev Ref: https://github.com/ethereum/EIPs/issues/721
//http://solidity.readthedocs.io/en/develop/contracts.html#arguments-for-base-constructors
contract OriginalToken is Cofounded, ERC20, ERC165 {
    bool private hasExecutedCofounderDistribution;
    address public airdropCampaign;
    struct Allowance {
      uint256 amount;
      bool    hasBeenPartiallyWithdrawn;
    }

    //***** Apparently Optional *****/
    /// @dev returns the name of the token
    string public name;
    /// @dev returns the symbol of the token (e.g. 'OCC')
    string public symbol;
    /// @dev returns the number of decimals the tokens use
    uint8 public decimals;
    //**********/

    /// @dev  returns the total token supply
    /// @note implemented as a state variable with an automatic (compiler provided) getter
    ///       instead of a constant (view/readonly) function.
    uint256 public totalSupply;

    uint256 constant private MAX_UINT256 = 2**256 - 1;

    mapping (address => uint256) public balances;
    // TODO: determine if the gas cost for handling the race condition
    //       (outlined here: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729)
    //       is cheaper this way (or this way: https://github.com/Giveth/minime/blob/master/contracts/MiniMeToken.sol#L221-L225)
    mapping (address => mapping (address => Allowance)) public allowances;

  /// @dev creates the token
  /// NOTE  passes tokenCofounders to base contract
  /// see   Cofounded
  function OriginalToken (address[15] tokenCofounders,
                          address tokenAirdropCampaign,
                          uint256 tokenTotalSupply,
                          string tokenName,
                          string tokenSymbol,
                          uint8 tokenDecimals,
                          uint256 cofounderDistribution) Cofounded(tokenCofounders) public {
    require(tokenAirdropCampaign != address(0));
    require(tokenTotalSupply > 0);
    require(tokenDecimals > 0);
    require(cofounderDistribution > 0 && tokenTotalSupply > cofounderDistribution);

    require(bytes(tokenName).length > 0);
    require(bytes(tokenSymbol).length > 0);

    airdropCampaign = tokenAirdropCampaign;
    totalSupply = tokenTotalSupply;
    name = tokenName;
    symbol = tokenSymbol;
    decimals = tokenDecimals;

    // divvy up initial token supply accross cofounders
    // TODO: ensure each cofounder gets an equal base distribution
    distributeToCofounders(tokenTotalSupply, cofounderDistribution);
  }

  function distributeToCofounders (uint256 initialSupply, uint256 cofounderDistribution) private restricted {
    require(!hasExecutedCofounderDistribution);

    hasExecutedCofounderDistribution = true;

    for (uint8 x = 0; x < cofounders.length; x++) {
      address cofounder = cofounders[x];

      if (cofounder == address(0)) continue;

      initialSupply -= cofounderDistribution;
      // there should be some left over for the airdrop campaign
      // otherwise don't create this contract
      //require(initialSupply > cofounderDistribution);
      balances[cofounder] = cofounderDistribution;
    }

    balances[airdropCampaign] = initialSupply;
  }

  function transfer (address to, uint256 value) public returns (bool) {
    // don't burn these tokens
    require(to != address(0));
    // match spec and emit events on 0 value
    if (value == 0) {
      Transfer(msg.sender, to, value);
      return true;
    }

    return transferBalance (msg.sender, to, value);
  }

  function transferFrom (address from, address to, uint256 value) public returns (bool success) {
        Allowance storage allowance = allowances[from][msg.sender];
        require(balances[from] >= value && allowance.amount >= value);

        if (allowance.amount == 0) {
          delete allowances[from][msg.sender];
        } else {
          allowance.hasBeenPartiallyWithdrawn = true;
          allowance.amount -= value;
        }

        balances[to] += value;
        balances[from] -= value;
        Transfer(from, to, value);
        return true;   
  }

  event ApprovalDenied (address indexed owner, address indexed spender, uint256 currentValue, uint256 value);

  // TODO: test with an unintialized Allowance struct
  function approve (address spender, uint256 value) public returns (bool success) {
    Allowance storage allowance = allowances[msg.sender][spender];

    if (value == 0) {
      delete allowances[msg.sender][spender];
      Approval(msg.sender, spender, value);
      return true;
    }

    if (allowance.hasBeenPartiallyWithdrawn) {
      delete allowances[msg.sender][spender];
      ApprovalDenied(msg.sender, spender, allowance.amount, value);
      return false;
    } else {
      allowance.amount = value;
      Approval(msg.sender, spender, value);
    }
  }

  function approveAndCall (address spender, uint256 value, bytes extraData) public returns (bool success) {
      bool hasSuccess;

      if (hasSuccess = approve(spender, value)) {
        ApprovedAllowanceAgent agent = ApprovedAllowanceAgent(spender);
        agent.receiveApproval(msg.sender, value, this, extraData);
      }

      return hasSuccess;
    }
 

  // TODO: compare gas cost estimations between this and https://github.com/ConsenSys/Tokens/blob/master/contracts/eip20/EIP20.sol#L39-L45
  function transferBalance (address from, address to, uint256 value) public returns (bool) {
    uint256 senderBalance = balances[from];
    uint256 receiverBalance = balances[to];
    require(senderBalance >= value);
    senderBalance -= value;
    receiverBalance += value;
    // overflow check (altough one could use https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol)
    require(receiverBalance >= value);

    balances[from] = senderBalance;
    balances[to] = receiverBalance;

    Transfer(from, to, value);
    return true;
  }

 
  // TODO: test with an unintialized Allowance struct
  function allowance (address owner, address spender) public constant returns (uint256 remaining) {
    return allowances[owner][spender].amount;
  }

  function balanceOf (address owner) public constant returns (uint256 balance) {
    return balances[owner];
  }

  function supportsInterface (bytes4 interfaceID) external constant returns (bool) {
    return (interfaceID == InterfaceSignature_ERC165);
  }

  bytes4 constant InterfaceSignature_ERC165 =
    bytes4(keccak256('supportsInterface(bytes4)'));
}


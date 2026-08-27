//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MyToken
 * @author Abhishek Maurya
 * @notice ERC20 token with role-based minting permissions.
 * @dev Uses OpenZeppelin's ERC20 and AccessControl implementations.
 * The deployer receives the DEFAULT_ADMIN_ROLE and can grant/revoke
 * the MINTER_ROLE to authorized accounts.
 */
contract MyToken is ERC20, AccessControl {
    /// @notice Role identifier for accounts authorized to mint tokens.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @notice Initializes the FomoBlock token.
     * @dev The deployer is granted the DEFAULT_ADMIN_ROLE, giving them
     * permission to manage roles, including granting MINTER_ROLE.
     */
    constructor() ERC20("FomoBlock", "FBCK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Mints new tokens to a specified account.
     * @dev Only accounts with MINTER_ROLE can call this function.
     * @param account The address that will receive the newly minted tokens.
     * @param value The amount of tokens to mint, in the token's smallest unit.
     */
    function mint(address account, uint256 value) external onlyRole(MINTER_ROLE) {
        _mint(account, value);
    }
}

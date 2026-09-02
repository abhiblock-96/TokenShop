//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Test} from "forge-std/Test.sol";
import {TokenShop} from "src/TokenShop.sol";
import {MyToken} from "src/MyToken.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";

/// @title BaseContract
/// @notice Base test contract providing common setup and utilities for
///         TokenShop and MyToken tests.
/// @dev Deploys the required contracts using the network configuration
///      provided by HelperConfig and funds the test minter account with ETH.
contract BaseContract is Test {
    /// @notice Instance of the MyToken contract used during testing.
    TokenShop internal tokenShop;

    /// @notice Instance of the TokenShop contract used during testing.
    MyToken internal myToken;

    /// @notice Address representing the administrator in tests.
    address internal admin = makeAddr("admin");

    /// @notice Address representing a user who can purchase tokens.
    address internal minter1 = makeAddr("minter1");

    /**
     * @notice Sets up the testing environment before each test.
     * @dev Creates the appropriate network configuration, deploys MyToken
     *      and TokenShop as the admin, and funds minter1 with 2 ETH.
     */
    function setUp() external {
        HelperConfig helperConfig = new HelperConfig();
        address priceFeed = helperConfig.activeNetwork();

        vm.startPrank(admin);
        myToken = new MyToken();
        tokenShop = new TokenShop(priceFeed, address(myToken));
        vm.stopPrank();

        vm.deal(minter1, 5 ether);
    }

    /**
     * @notice Grants the MINTER_ROLE to the TokenShop contract.
     * @dev Must be called by the admin because the admin owns the
     *      DEFAULT_ADMIN_ROLE on MyToken.
     */
    function _grantRole() internal {
        bytes32 minterRole = myToken.MINTER_ROLE();

        vm.prank(admin);
        myToken.grantRole(minterRole, address(tokenShop));
    }

    /**
     * @notice Deposits ETH into the TokenShop contract.
     * @dev Grants the required minter role and deposits the specified amount
     *      of ETH into the TokenShop contract.
     * @param amount The amount of ETH to deposit.
     */
    function _deposit(uint256 amount) internal {
        _grantRole();

        vm.prank(minter1);
        (bool success,) = address(tokenShop).call{value: amount}("");
        assertTrue(success);
    }

    /**
     * @notice Transfers ownership of the TokenShop contract to a new owner.
     * @dev Transfers ownership of the TokenShop contract to a new owner.
     * @param newOwner The address to receive ownership of the TokenShop contract.
     */
    function _transferOwnership(address newOwner) internal {
        vm.prank(admin);
        tokenShop.transferOwnership(newOwner);
    }
}

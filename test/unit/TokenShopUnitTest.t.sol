//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {BaseContract} from "test/helper/BaseContract.sol";

/// @title TokenShopUnitTest
/// @notice Unit tests for the TokenShop and MyToken contracts.
/// @dev Inherits the common deployment and test setup from BaseContract.
contract TokenShopUnitTest is BaseContract {
    /**
     * @notice Verifies that the TokenShop owner is the admin account.
     */
    function test_owner_ReturnsAdmin() external view {
        assertEq(tokenShop.owner(), admin);
    }

    /**
     * @notice Verifies that the admin account has the default admin role
     *         on the MyToken contract.
     */
    function test_hasRole_AdminHasDefaultAdminRole() external view {
        assertTrue(myToken.hasRole(myToken.DEFAULT_ADMIN_ROLE(), admin));
    }

    /**
     * @notice Verifies that TokenShop receives the MINTER_ROLE after
     *         the admin grants it.
     */
    function test_hasRole_TokenShopHasMinterRole() external {
        _grantRole();
        assertTrue(myToken.hasRole(myToken.MINTER_ROLE(), address(tokenShop)));
    }

    /**
     * @notice Verifies that sending ETH to TokenShop successfully mints
     *         the expected amount of MyToken to the buyer.
     * @dev The TokenShop must have MINTER_ROLE before the purchase.
     */
    function test_buyToken_MintsExpectedAmount() external {
        _grantRole();

        vm.prank(minter1);
        (bool success,) = address(tokenShop).call{value: 2 ether}("");

        assertTrue(success);

        assertEq(myToken.balanceOf(minter1), tokenShop.amountToBuy(2 ether));
    }
}

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {BaseContract} from "test/helper/BaseContract.sol";
import {TokenShop} from "src/TokenShop.sol";
import {MyToken} from "src/MyToken.sol";
import {TestContract} from "test/mocks/TestContract.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

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
     * @notice Verifies that a buyer can purchase tokens by sending ETH through
     *         the buyTokens function and receives the expected amount of tokens.
     * @dev The TokenShop must have MINTER_ROLE before the purchase.
     */
    function test_buyToken_MintsExpectedAmount() external {
        _grantRole();

        vm.prank(minter1);
        tokenShop.buyTokens{value: 2 ether}();

        assertEq(myToken.balanceOf(minter1), tokenShop.amountToBuy(2 ether));
    }

    /**
     * @notice Verifies that buying tokens reverts when zero ETH is sent.
     */
    function test_buyToken_RevertIfETHAmountIsZero() external {
        _grantRole();

        vm.prank(minter1);
        vm.expectRevert(TokenShop.AmountMustBeMoreThanZero.selector);
        tokenShop.buyTokens{value: 0}();
    }

    /**
     * @notice Verifies that a token purchase reverts when TokenShop does
     *         not have the MINTER_ROLE.
     * @dev The test confirms that MyToken rejects the unauthorized mint
     *      attempt originating from TokenShop.
     */
    function test_buyToken_RevertIfTokenShopHasNoMinterRole() external {
        bytes32 role = myToken.MINTER_ROLE();

        vm.prank(minter1);
        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, address(tokenShop), role)
        );

        tokenShop.buyTokens{value: 2 ether}();
    }

    /**
     * @notice Verifies that the ETH sent for a failed token purchase is
     *         reverted when token minting fails.
     * @dev TokenShop must not retain ETH from a failed purchase.
     */
    function test_buyToken_RevertIfMintFailsAndRefundETH() external {
        uint256 minterBalBefore = minter1.balance;

        bytes32 role = myToken.MINTER_ROLE();

        vm.prank(minter1);
        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, address(tokenShop), role)
        );

        tokenShop.buyTokens{value: 2 ether}();

        uint256 minterBalAfter = minter1.balance;

        assertEq(minterBalAfter, minterBalBefore);
    }

    /**
     * @notice Verifies that amountToBuy returns zero when zero ETH is
     *         provided.
     */
    function test_amountToBuy_ReturnsZeroForZeroETH() external view {
        assertEq(tokenShop.amountToBuy(0), 0);
    }

    /**
     * @notice Verifies that amountToBuy returns a non-zero token amount
     *         for a valid ETH amount.
     */
    function test_amountToBuy_ReturnsNonZeroAmountForValidETH() external view {
        assertGt(tokenShop.amountToBuy(1 ether), 0);
    }

    /**
     * @notice Verifies that an account without MINTER_ROLE cannot directly
     *         mint MyToken.
     */
    function test_mint_RevertIfCallerHasNoMinterRole() external {
        bytes32 role = myToken.MINTER_ROLE();

        vm.prank(minter1);
        vm.expectRevert(abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, minter1, role));

        myToken.mint(minter1, 500);
    }

    /**
     * @notice Verifies that the contract rejects plain ETH transfers.
     * @dev Sends ETH directly to TokenShop without calldata and expects
     *      the transfer to revert with DirectEtherNotAcceptable.
     */
    function test_receive_RevertsOnPlainEtherTransfer() external {
        vm.prank(minter1);
        vm.expectRevert(TokenShop.DirectEtherNotAcceptable.selector);
        (bool success,) = payable(tokenShop).call{value: 2 ether}("");
    }

    /**
     * @notice Verifies that the contract rejects ETH transfers with an
     *      unsupported function selector.
     * @dev Calls TokenShop with the buyTokens selector using a low-level call
     *      and expects the fallback function to revert with
     *      DirectEtherNotAcceptable.
     */
    function test_fallback_RevertsOnUnsupportedCall() external {
        vm.prank(minter1);
        vm.expectRevert(TokenShop.DirectEtherNotAcceptable.selector);
        (bool success,) = payable(tokenShop).call{value: 2 ether}(abi.encodeWithSelector(tokenShop.buyTokens.selector));
    }

    /**
     * @notice Verifies that a successful token purchase emits the
     *         MintSucceed event with the correct buyer and token amount.
     */
    function test_buyToken_EmitsMintSucceedEvent() external {
        _grantRole();

        vm.expectEmit(true, false, false, true);
        emit TokenShop.MintSucceed(minter1, tokenShop.amountToBuy(1 ether));

        vm.prank(minter1);
        tokenShop.buyTokens{value: 1 ether}();
    }

    /**
     * @notice Verifies that the owner can withdraw deposited ETH.
     */
    function test_withdraw_SucceedsForOwner() external {
        _buyToken(2 ether);

        vm.prank(admin);
        tokenShop.withdraw();

        assertEq(admin.balance, 2 ether);
        assertEq(address(tokenShop).balance, 0);
    }

    /**
     * @notice Verifies that a non-owner cannot withdraw ETH from TokenShop.
     */
    function test_withdraw_RevertIfNonOwnerCall() external {
        _buyToken(2 ether);

        vm.prank(minter1);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, minter1));

        tokenShop.withdraw();
    }

    /**
     * @notice Verifies that withdrawal reverts when the TokenShop has
     *         no funds.
     */
    function test_withdraw_RevertIfNoFundsDeposited() external {
        vm.prank(admin);
        vm.expectRevert(TokenShop.NoFundToWithdraw.selector);
        tokenShop.withdraw();
    }

    /**
     * @notice Verifies that withdrawal reverts when the ETH transfer to
     *         the owner fails.
     */
    function test_withdraw_RevertIfTransferFails() external {
        _buyToken(2 ether);

        TestContract testContract = new TestContract();
        _transferOwnership(address(testContract));

        vm.prank(address(testContract));
        vm.expectRevert(TokenShop.WithdrawFailed.selector);

        tokenShop.withdraw();
    }

    /**
     * @notice Verifies that the owner can withdraw the complete ETH balance
     *         accumulated from multiple deposits.
     */
    function test_withdraw_WithdrawsCompleteBalanceForMultipleDeposits() external {
        _buyToken(1 ether);

        vm.prank(minter1);
        tokenShop.buyTokens{value: 3 ether}();

        uint256 adminBalBefore = admin.balance;
        uint256 vaultBalBefore = address(tokenShop).balance;

        vm.prank(admin);
        tokenShop.withdraw();

        uint256 adminBalAfter = admin.balance;
        uint256 vaultBalAfter = address(tokenShop).balance;

        assertEq(vaultBalBefore - vaultBalAfter, 4 ether);
        assertEq(adminBalAfter - adminBalBefore, 4 ether);
    }

    /**
     * @notice Verifies that a successful withdrawal emits the Withdraw
     *         event with the TokenShop, owner, and withdrawn amount.
     */
    function test_withdraw_EmitsWithdrawEvent() external {
        _buyToken(2 ether);

        vm.expectEmit(true, true, false, true);
        emit TokenShop.Withdraw(address(tokenShop), admin, address(tokenShop).balance);

        vm.prank(admin);
        tokenShop.withdraw();
    }

    /**
     * @notice Verifies that the Chainlink ETH/USD price is returned
     *         correctly by TokenShop.
     */
    function test_getChainlinkETHPrice_ReturnsETHPriceInUSD() external view {
        assertEq(tokenShop.getChainlinkETHPrice(), 244500000000);
    }

    /**
     * @notice Verifies that buying tokens with the maximum uint256 ETH amount
     *         reverts.
     * @dev Gives the buyer a balance of type(uint256).max, attempts to purchase
     *      tokens by sending the maximum possible uint256 value as ETH, and
     *      expects the transaction to revert.
     */
    function test_buyTokens_RevertsWhenETHAmountIsMax() external {
        address buyer = makeAddr("buyer");
        uint256 maxAmt = type(uint256).max;
        vm.deal(buyer, maxAmt);

        vm.prank(buyer);
        vm.expectRevert();
        tokenShop.buyTokens{value: maxAmt}();
    }
}

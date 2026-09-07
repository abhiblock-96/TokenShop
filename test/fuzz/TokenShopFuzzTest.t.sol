//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {BaseContract} from "test/helper/BaseContract.sol";
import {TokenShop} from "src/TokenShop.sol";
import {MyToken} from "src/MyToken.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenShopFuzz is BaseContract {
    /**
     * @notice Verifies that multiple buyers receive exactly the amount of
     *         tokens calculated by the TokenShop for their ETH payment.
     */
    function testFuzz_buyToken_MultipleBuyersReceiveExpectedTokens(
        address buyer1,
        address buyer2,
        uint256 buyer1EthAmount,
        uint256 ethBalance,
        uint256 buyer2EthAmount
    ) external {
        vm.assume(buyer1 != address(0) && buyer1 != address(tokenShop));
        vm.assume(buyer2 != address(0) && buyer2 != address(tokenShop));

        ethBalance = bound(ethBalance, 2 ether, 100 ether);
        buyer1EthAmount = bound(buyer1EthAmount, 1 ether, ethBalance);
        buyer2EthAmount = bound(buyer2EthAmount, 1 ether, ethBalance);

        vm.deal(buyer1, ethBalance);
        vm.deal(buyer2, ethBalance);

        _grantRole();

        uint256 buyer1AmtBefore = myToken.balanceOf(buyer1);

        vm.prank(buyer1);
        (bool success1,) = payable(tokenShop).call{value: buyer1EthAmount}("");
        assertTrue(success1);

        uint256 buyer1AmtAfter = myToken.balanceOf(buyer1);

        uint256 buyer2AmtBefore = myToken.balanceOf(buyer2);

        vm.prank(buyer2);
        (bool success2,) = payable(tokenShop).call{value: buyer2EthAmount}("");
        assertTrue(success2);

        uint256 buyer2AmtAfter = myToken.balanceOf(buyer2);

        assertEq(buyer1AmtAfter - buyer1AmtBefore, tokenShop.amountToBuy(buyer1EthAmount));

        assertEq(buyer2AmtAfter - buyer2AmtBefore, tokenShop.amountToBuy(buyer2EthAmount));
    }

    /**
     * @notice Verifies that the total token supply increases exactly by the
     *         amount minted to buyers after successful purchases.
     */
    function testFuzz_buyToken_TotalSupplyEqualsMintedTokens(
        address buyer1,
        address buyer2,
        uint256 ethBalance,
        uint256 buyer1EthAmount,
        uint256 buyer2EthAmount
    ) external {
        vm.assume(buyer1 != address(0) && buyer1 != address(tokenShop));
        vm.assume(buyer2 != address(0) && buyer2 != address(tokenShop));

        ethBalance = bound(ethBalance, 2 ether, 100 ether);
        buyer1EthAmount = bound(buyer1EthAmount, 1 ether, ethBalance);
        buyer2EthAmount = bound(buyer2EthAmount, 1 ether, ethBalance);

        vm.deal(buyer1, ethBalance);
        vm.deal(buyer2, ethBalance);

        _grantRole();

        assertEq(myToken.totalSupply(), 0);

        vm.prank(buyer1);
        (bool success1,) = payable(tokenShop).call{value: buyer1EthAmount}("");
        assertTrue(success1);

        uint256 buyer1Amt = myToken.balanceOf(buyer1);

        vm.prank(buyer2);
        (bool success2,) = payable(tokenShop).call{value: buyer2EthAmount}("");
        assertTrue(success2);

        uint256 buyer2Amt = myToken.balanceOf(buyer2);

        assertEq(myToken.totalSupply(), buyer1Amt + buyer2Amt);
    }

    /**
     * @notice Verifies that the TokenShop retains exactly the ETH deposited
     *         by buyers after successful purchases.
     */
    function testFuzz_buyToken_VaultBalanceIncreasesByDepositedETH(
        address buyer1,
        address buyer2,
        uint256 ethBalance,
        uint256 buyer1EthAmount,
        uint256 buyer2EthAmount
    ) external {
        vm.assume(buyer1 != address(0) && buyer1 != address(tokenShop));
        vm.assume(buyer2 != address(0) && buyer2 != address(tokenShop));

        ethBalance = bound(ethBalance, 2 ether, 100 ether);
        buyer1EthAmount = bound(buyer1EthAmount, 1 ether, ethBalance);
        buyer2EthAmount = bound(buyer2EthAmount, 1 ether, ethBalance);

        vm.deal(buyer1, ethBalance);
        vm.deal(buyer2, ethBalance);

        _grantRole();

        uint256 vaultBalBefore = address(tokenShop).balance;

        vm.prank(buyer1);
        (bool success1,) = payable(tokenShop).call{value: buyer1EthAmount}("");
        assertTrue(success1);

        vm.prank(buyer2);
        (bool success2,) = payable(tokenShop).call{value: buyer2EthAmount}("");
        assertTrue(success2);

        uint256 vaultBalAfter = address(tokenShop).balance;

        assertEq(vaultBalAfter - vaultBalBefore, buyer1EthAmount + buyer2EthAmount);
    }

    /**
     * @notice Verifies that repeated purchases by the same buyer are
     *         cumulatively reflected in their token balance.
     */
    function testFuzz_buyToken_RepeatedPurchasesAccumulateCorrectly(
        address buyer,
        uint256 ethBalance,
        uint256 buyerEthAmount1,
        uint256 buyerEthAmount2
    ) external {
        vm.assume(buyer != address(0) && buyer != address(tokenShop));

        ethBalance = bound(ethBalance, 2 ether, 1000 ether);
        buyerEthAmount1 = bound(buyerEthAmount1, 1 ether, ethBalance / 2);
        buyerEthAmount2 = bound(buyerEthAmount2, 1 ether, ethBalance / 2);

        _grantRole();
        vm.deal(buyer, ethBalance);

        uint256 initialBuyerTokens = myToken.balanceOf(buyer);

        uint256 expectedTokens1 = tokenShop.amountToBuy(buyerEthAmount1);
        uint256 expectedTokens2 = tokenShop.amountToBuy(buyerEthAmount2);

        vm.prank(buyer);
        (bool success1,) = payable(tokenShop).call{value: buyerEthAmount1}("");
        assertTrue(success1);

        uint256 buyerTokensAfterFirstPurchase = myToken.balanceOf(buyer);

        vm.prank(buyer);
        (bool success2,) = payable(tokenShop).call{value: buyerEthAmount2}("");
        assertTrue(success2);

        uint256 buyerTokensAfterSecondPurchase = myToken.balanceOf(buyer);

        assertEq(buyerTokensAfterFirstPurchase - initialBuyerTokens, expectedTokens1);

        assertEq(buyerTokensAfterSecondPurchase - buyerTokensAfterFirstPurchase, expectedTokens2);

        assertEq(buyerTokensAfterSecondPurchase, initialBuyerTokens + expectedTokens1 + expectedTokens2);
    }

    /**
     * @notice Verifies token and ETH accounting for very small ETH deposits,
     *         including values close to integer-division boundaries.
     */
    function testFuzz_buyToken_SmallETHAmountsMaintainCorrectAccounting(
        address buyer,
        uint256 ethBalance,
        uint256 buyerEthAmount1,
        uint256 buyerEthAmount2
    ) external {
        vm.assume(buyer != address(0) && buyer != address(tokenShop));

        ethBalance = bound(ethBalance, 4 wei, 10 ether);
        buyerEthAmount1 = bound(buyerEthAmount1, 1 wei, ethBalance / 2);
        buyerEthAmount2 = bound(buyerEthAmount2, 2 wei, ethBalance / 2);

        _grantRole();
        vm.deal(buyer, ethBalance);

        uint256 buyerTokensBefore = myToken.balanceOf(buyer);
        uint256 vaultEthBefore = address(tokenShop).balance;

        vm.prank(buyer);
        (bool success1,) = payable(tokenShop).call{value: buyerEthAmount1}("");
        assertTrue(success1);

        vm.prank(buyer);
        (bool success2,) = payable(tokenShop).call{value: buyerEthAmount2}("");
        assertTrue(success2);

        uint256 buyerTokensAfter = myToken.balanceOf(buyer);
        uint256 vaultEthAfter = address(tokenShop).balance;

        uint256 expectedTokens = tokenShop.amountToBuy(buyerEthAmount1) + tokenShop.amountToBuy(buyerEthAmount2);

        assertEq(buyerTokensAfter - buyerTokensBefore, expectedTokens);

        assertEq(vaultEthAfter - vaultEthBefore, buyerEthAmount1 + buyerEthAmount2);
    }

    /**
     * @notice Verifies the monotonicity property that a larger ETH payment
     *         results in a larger token amount when oracle and token prices
     *         remain unchanged.
     */
    function testFuzz_buyToken_MoreETHMintsMoreTokens(
        address buyer,
        uint256 ethBalance,
        uint256 buyerEthAmount1,
        uint256 buyerEthAmount2
    ) external {
        vm.assume(buyer != address(0) && buyer != address(tokenShop));

        ethBalance = bound(ethBalance, 4 wei, 100 ether);
        buyerEthAmount1 = bound(buyerEthAmount1, 1 wei, ethBalance / 2);
        buyerEthAmount2 = bound(buyerEthAmount2, 2 wei, ethBalance / 2);

        vm.assume(buyerEthAmount2 > buyerEthAmount1);

        _grantRole();
        vm.deal(buyer, ethBalance);

        vm.prank(buyer);
        (bool success1,) = payable(tokenShop).call{value: buyerEthAmount1}("");
        assertTrue(success1);

        uint256 expectedTokenBefore = tokenShop.amountToBuy(buyerEthAmount1);

        vm.prank(buyer);
        (bool success2,) = payable(tokenShop).call{value: buyerEthAmount2}("");
        assertTrue(success2);

        uint256 expectedTokenAfter = tokenShop.amountToBuy(buyerEthAmount2);

        assertGt(expectedTokenAfter, expectedTokenBefore);
    }

    /**
     * @notice Verifies that the owner can withdraw all ETH held by the
     *         TokenShop.
     */
    function testFuzz_withdraw_OwnerCanWithdrawFunds(
        address buyer1,
        address buyer2,
        uint256 ethBalance,
        uint256 buyer1EthAmount,
        uint256 buyer2EthAmount
    ) external {
        vm.assume(buyer1 != address(0) && buyer1 != address(tokenShop));
        vm.assume(buyer2 != address(0) && buyer2 != address(tokenShop));

        ethBalance = bound(ethBalance, 2 ether, 100 ether);
        buyer1EthAmount = bound(buyer1EthAmount, 1 ether, ethBalance / 2);
        buyer2EthAmount = bound(buyer2EthAmount, 1 ether, ethBalance / 2);

        vm.deal(buyer1, ethBalance);
        vm.deal(buyer2, ethBalance);

        _grantRole();

        vm.prank(buyer1);
        (bool success1,) = payable(tokenShop).call{value: buyer1EthAmount}("");
        assertTrue(success1);

        vm.prank(buyer2);
        (bool success2,) = payable(tokenShop).call{value: buyer2EthAmount}("");
        assertTrue(success2);

        uint256 adminBalBefore = admin.balance;

        vm.prank(admin);
        tokenShop.withdraw();

        uint256 adminBalAfter = admin.balance;

        uint256 totalVaultBal = buyer1EthAmount + buyer2EthAmount;

        assertEq(address(tokenShop).balance, 0);
        assertEq(adminBalAfter, adminBalBefore + totalVaultBal);
    }

    /**
     * @notice Verifies that an address other than the owner cannot withdraw
     *         ETH from the TokenShop.
     */
    function testFuzz_withdraw_RevertIfCallerIsNotOwner(
        address buyer,
        address account,
        uint256 ethBalance,
        uint256 buyerEthAmount
    ) external {
        vm.assume(buyer != address(0) && buyer != address(tokenShop));
        vm.assume(account != admin);

        ethBalance = bound(ethBalance, 1 ether, 100 ether);
        buyerEthAmount = bound(buyerEthAmount, 1 ether, ethBalance);

        vm.deal(buyer, ethBalance);

        _grantRole();

        vm.prank(buyer);
        (bool success1,) = payable(tokenShop).call{value: buyerEthAmount}("");
        assertTrue(success1);

        vm.prank(account);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, account));
        tokenShop.withdraw();
    }
}

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/shared/interfaces/AggregatorV3Interface.sol";
import {MyToken} from "src/MyToken.sol";

/**
 * @title TokenShop
 * @author Abhishek Maurya
 * @notice Allows users to purchase FomoBlock (FBCK) tokens with ETH.
 * @dev Uses Chainlink ETH/USD price data to calculate the amount of
 * FBCK tokens a user receives. The contract owner can withdraw
 * ETH accumulated from token purchases.
 */
contract TokenShop is Ownable {
    /// @notice The ERC20 token being sold by the shop.
    MyToken internal erc20Token;

    /// @notice Chainlink price feed used to obtain the ETH/USD price.
    AggregatorV3Interface internal tokenPrice;

    /// @notice Number of decimals used by the token.
    uint256 public constant TOKEN_DECIMAL = 18;

    /// @notice Price of one token in USD, represented with 18 decimals.
    uint256 public constant TOKEN_PRICE_USD = 3 * 10 ** TOKEN_DECIMAL;

    /**
     * @notice Emitted when a buyer successfully purchases and receives tokens.
     * @param buyer The address that receives the minted tokens.
     * @param amount The amount of tokens minted to the buyer.
     */
    event MintSucceed(address indexed buyer, uint256 amount);

    /**
     * @notice Emitted when ETH is successfully withdrawn from the TokenShop.
     * @param from The address from which the ETH is withdrawn.
     * @param to The address receiving the withdrawn ETH.
     * @param amount The amount of ETH withdrawn.
     */
    event Withdraw(address indexed from, address indexed to, uint256 amount);

    /// @notice Thrown when a user sends zero ETH to purchase tokens.
    error AmountMustBeMoreThanZero();

    /// @notice Thrown when the owner attempts to withdraw with no ETH available.
    error NoFundToWithdraw();

    /// @notice Thrown when the ETH withdrawal fails.
    error WithdrawFailed();

    /**
     * @notice Initializes the TokenShop.
     * @param _tokenPrice Address of the Chainlink ETH/USD price feed.
     * @param _token Address of the FomoBlock ERC20 token contract.
     */
    constructor(address _tokenPrice, address _token) Ownable(msg.sender) {
        erc20Token = MyToken(_token);
        tokenPrice = AggregatorV3Interface(_tokenPrice);
    }

    /**
     * @notice Allows users to purchase tokens by sending ETH directly
     *         to the contract.
     * @dev The amount of FBCK tokens minted is calculated using the
     *      current ETH/USD Chainlink price.
     */
    receive() external payable {
        if (msg.value == 0) revert AmountMustBeMoreThanZero();
        uint256 tokenAmount = amountToBuy(msg.value);
        erc20Token.mint(msg.sender, tokenAmount);
        emit MintSucceed(msg.sender, tokenAmount);
    }

    /**
     * @notice Returns the latest ETH/USD price from Chainlink.
     * @return price The latest ETH/USD price reported by the price feed.
     */
    function getChainlinkETHPrice() public view returns (int256 price) {
        (, price,,,) = tokenPrice.latestRoundData();
    }

    /**
     * @notice Calculates how many FBCK tokens can be purchased for a given
     *         amount of ETH.
     * @dev Converts the Chainlink price from 8 decimals to 18 decimals,
     *      calculates the USD value of the supplied ETH, and then determines
     *      the corresponding amount of FBCK tokens.
     * @param amount The amount of ETH sent, denominated in wei.
     * @return The amount of FBCK tokens that can be purchased.
     */
    function amountToBuy(uint256 amount) public view returns (uint256) {
        uint256 ethPrice = uint256(getChainlinkETHPrice()) * 10 ** 10;
        uint256 ethAmountInUsd = (amount * ethPrice) / 10 ** 18;
        return (ethAmountInUsd * 10 ** 18) / TOKEN_PRICE_USD;
    }

    /**
     * @notice Withdraws all ETH held by the shop.
     * @dev Can only be called by the contract owner.
     *      Reverts if the contract has no ETH or if the transfer fails.
     *      Emits a Withdraw event after a successful transfer.
     */
    function withdraw() external onlyOwner {
        if (address(this).balance == 0) revert NoFundToWithdraw();

        uint256 totalBal = address(this).balance;

        (bool success,) = payable(msg.sender).call{value: totalBal}("");
        if (!success) revert WithdrawFailed();

        emit Withdraw(address(this), msg.sender, totalBal);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import {Test} from "forge-std/Test.sol";

import {MyToken} from "src/MyToken.sol";
import {TokenShop} from "src/TokenShop.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";

/**
 * @title TokenShopForkTest
 * @notice Tests TokenShop on Anvil, Sepolia, and Ethereum Mainnet forks.
 * @dev Uses Foundry fork testing to verify TokenShop integration with
 *      Chainlink ETH/USD price feeds on different networks.
 */
contract TokenShopForkTest is Test {
    /// @notice Token contract used by TokenShop.
    MyToken internal token;

    /// @notice TokenShop contract under test.
    TokenShop internal shop;

    /// @notice Network configuration used to obtain the Chainlink price feed.
    HelperConfig internal helperConfig;

    /// @notice Address representing the buyer in the tests.
    address internal buyer = makeAddr("buyer");

    /// @notice Address representing the owner in the tests.
    address internal owner = makeAddr("owner");

    /// @notice Identifier of the Sepolia fork.
    uint256 internal sepoliaFork;

    /// @notice Identifier of the Ethereum Mainnet fork.
    uint256 internal mainnetFork;

    /**
     * @notice Creates the Sepolia and Mainnet forks.
     * @dev The created forks are selected inside their respective setup
     *      functions before deploying and testing TokenShop.
     */
    function setUp() public {
        sepoliaFork = vm.createFork(vm.envString("SEPOLIA_RPC_URL"));
        mainnetFork = vm.createFork(vm.envString("MAINNET_RPC_URL"));
    }

    /**
     * @notice Selects the Sepolia fork and deploys the test contracts.
     * @dev HelperConfig is instantiated after selecting the fork so that
     *      it detects the Sepolia chain ID and returns the corresponding
     *      Chainlink price feed.
     */
    function setUpSepoliaFork() internal {
        vm.selectFork(sepoliaFork);

        helperConfig = new HelperConfig();
        address priceFeed = helperConfig.activeNetwork();

        vm.startPrank(owner);
        token = new MyToken();
        shop = new TokenShop(priceFeed, address(token));
        vm.stopPrank();

        vm.deal(buyer, 10 ether);
    }

    /**
     * @notice Selects the Mainnet fork and deploys the test contracts.
     * @dev HelperConfig is instantiated after selecting the fork so that
     *      it detects the Mainnet chain ID and returns the corresponding
     *      Chainlink price feed.
     */
    function setUpMainnetFork() internal {
        vm.selectFork(mainnetFork);

        helperConfig = new HelperConfig();
        address priceFeed = helperConfig.activeNetwork();

        vm.startPrank(owner);
        token = new MyToken();
        shop = new TokenShop(priceFeed, address(token));
        vm.stopPrank();

        vm.deal(buyer, 10 ether);
    }

    /**
     * @notice Deploys TokenShop using the local Anvil configuration.
     * @dev HelperConfig determines the Chainlink price feed configured
     *      for the Anvil environment.
     */
    function setUpAnvil() internal {
        helperConfig = new HelperConfig();
        address priceFeed = helperConfig.activeNetwork();

        vm.startPrank(owner);
        token = new MyToken();
        shop = new TokenShop(priceFeed, address(token));
        vm.stopPrank();

        vm.deal(buyer, 10 ether);
    }

    /**
     * @notice Verifies that TokenShop returns a valid ETH/USD price on Anvil.
     */
    function test_GetChainlinkPriceFeed_ReturnsAnvilETHPriceInUSD() external {
        setUpAnvil();

        assertGt(shop.getChainlinkETHPrice(), 0);
    }

    /**
     * @notice Verifies that buying 2 ETH worth of tokens on Anvil
     *         mints the exact amount calculated by TokenShop.
     */
    function test_BuyTokens_MintsExactAmountOfTokensOnAnvil() external {
        setUpAnvil();

        bytes32 minterRole = token.MINTER_ROLE();

        vm.prank(owner);
        token.grantRole(minterRole, address(shop));

        vm.prank(buyer);
        (bool success,) = address(shop).call{value: 2 ether}("");
        assertTrue(success);

        assertEq(token.balanceOf(buyer), shop.amountToBuy(2 ether));
    }

    /**
     * @notice Verifies that TokenShop returns a valid ETH/USD price
     *         using the real Chainlink feed on the Sepolia fork.
     */
    function testFork_GetChainlinkPriceFeed_ReturnsSepoliaETHPriceInUSD() external {
        setUpSepoliaFork();

        assertGt(shop.getChainlinkETHPrice(), 0);
    }

    /**
     * @notice Verifies that buying 2 ETH worth of tokens on the Sepolia fork
     *         mints the exact amount calculated using the forked Chainlink
     *         ETH/USD price feed.
     */
    function testFork_BuyTokens_MintsExactAmountOfTokensOnSepolia() external {
        setUpSepoliaFork();

        bytes32 minterRole = token.MINTER_ROLE();

        vm.prank(owner);
        token.grantRole(minterRole, address(shop));

        vm.prank(buyer);
        (bool success,) = address(shop).call{value: 2 ether}("");
        assertTrue(success);

        assertEq(token.balanceOf(buyer), shop.amountToBuy(2 ether));
    }

    /**
     * @notice Verifies that TokenShop returns a valid ETH/USD price
     *         using the real Chainlink feed on the Mainnet fork.
     */
    function testFork_GetChainlinkPriceFeed_ReturnsMainnetETHPriceInUSD() external {
        setUpMainnetFork();

        assertGt(shop.getChainlinkETHPrice(), 0);
    }

    /**
     * @notice Verifies that buying 2 ETH worth of tokens on the Mainnet fork
     *         mints the exact amount calculated using the forked Chainlink
     *         ETH/USD price feed.
     */
    function testFork_BuyTokens_MintsExactAmountOfTokensOnMainnet() external {
        setUpMainnetFork();

        bytes32 minterRole = token.MINTER_ROLE();

        vm.prank(owner);
        token.grantRole(minterRole, address(shop));

        vm.prank(buyer);
        (bool success,) = address(shop).call{value: 2 ether}("");
        assertTrue(success);

        assertEq(token.balanceOf(buyer), shop.amountToBuy(2 ether));
    }
}

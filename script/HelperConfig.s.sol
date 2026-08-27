//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Script} from "forge-std/Script.sol";
import {MockV3Aggregator} from "test/mocks/MockV3Aggregator.sol";

/// @title HelperConfig
/// @notice Provides network-specific configuration for the TokenShop deployment.
/// @dev Uses Chainlink price feeds on Sepolia and Mainnet, while deploying a
///      mock price feed when running on Anvil/local development networks.
contract HelperConfig is Script {
    /// @notice Configuration parameters required by the application.
    /// @param priceFeed Address of the ETH/USD price feed.
    struct NetworkConfig {
        address priceFeed;
    }

    /// @notice Configuration for the currently detected network.
    NetworkConfig public activeNetwork;

    /**
     * @notice Initializes the network configuration.
     * @dev Selects the appropriate configuration based on the current chain ID:
     *      - Sepolia: Uses the Sepolia ETH/USD Chainlink price feed.
     *      - Mainnet: Uses the Mainnet ETH/USD Chainlink price feed.
     *      - Other networks: Deploys and uses a mock price feed.
     */
    constructor() {
        if (block.chainid == 11155111) {
            activeNetwork = getSepoliaEthConfig();
        } else if (block.chainid == 1) {
            activeNetwork = getMainnetEthConfig();
        } else {
            activeNetwork = getAnvilConfig();
        }
    }

    /**
     * @notice Returns the Sepolia network configuration.
     * @return NetworkConfig containing the Sepolia ETH/USD price feed address.
     */
    function getSepoliaEthConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory sepoliaConfig = NetworkConfig({priceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306});
        return sepoliaConfig;
    }

    /**
     * @notice Returns the Ethereum Mainnet network configuration.
     * @return NetworkConfig containing the Mainnet ETH/USD price feed address.
     */
    function getMainnetEthConfig() public pure returns (NetworkConfig memory) {
        NetworkConfig memory ethConfig = NetworkConfig({priceFeed: 0x5147eA642CAEF7BD9c1265AadcA78f997AbB9649});
        return ethConfig;
    }

    /**
     * @notice Deploys and returns a mock price feed configuration for Anvil.
     * @dev Creates a MockV3Aggregator with 8 decimals and an initial ETH/USD
     *      price of $2,445.00.
     * @return NetworkConfig containing the deployed mock price feed address.
     */
    function getAnvilConfig() public returns (NetworkConfig memory) {
        vm.startBroadcast();
        MockV3Aggregator mockAggregator = new MockV3Aggregator(8, 244500000000);
        vm.stopBroadcast();

        NetworkConfig memory anvilConfig = NetworkConfig({priceFeed: address(mockAggregator)});

        return anvilConfig;
    }
}

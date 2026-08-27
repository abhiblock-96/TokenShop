//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {MyToken} from "src/MyToken.sol";
import {TokenShop} from "src/TokenShop.sol";
import {Script} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

/// @title DeployTokenShop
/// @notice Foundry deployment script for deploying MyToken and TokenShop.
/// @dev Uses HelperConfig to determine the appropriate Chainlink price feed
///      for the current network before deploying the contracts.
contract DeployTokenShop is Script {
    /// @notice Instance of the deployed MyToken contract.
    MyToken internal myToken;

    /// @notice Instance of the deployed TokenShop contract.
    TokenShop internal tokenShop;

    /**
     * @notice Deploys MyToken and TokenShop contracts.
     * @dev Retrieves the network-specific price feed from HelperConfig,
     *      starts a broadcast transaction, deploys MyToken first, and then
     *      deploys TokenShop using the selected price feed and token address.
     */
    function run() public {
        HelperConfig helperConfig = new HelperConfig();
        address priceFeed = helperConfig.activeNetwork();

        vm.startBroadcast();
        myToken = new MyToken();
        tokenShop = new TokenShop(priceFeed, address(myToken));
        vm.stopBroadcast();
    }
}

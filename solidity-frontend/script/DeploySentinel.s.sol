// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Sentinel.sol";

contract DeploySentinel is Script {
    function run() external {
        address pvmEngine = vm.envAddress("PVM_CONTRACT_ADDRESS");
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        Sentinel sentinel = new Sentinel(pvmEngine);

        vm.stopBroadcast();

        // Log the deployed address to console
        console.log("Sentinel deployed at:", address(sentinel));

        // Write deployment info to JSON for the frontend
        string memory json = vm.serializeAddress("deploy", "sentinel", address(sentinel));
        json = vm.serializeAddress("deploy", "pvmEngine", pvmEngine);
        vm.writeJson(json, "./deployments.json");

        console.log("Saved to deployments.json");
    }
}

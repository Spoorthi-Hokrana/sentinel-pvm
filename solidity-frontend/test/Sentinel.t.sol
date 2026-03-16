// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Sentinel.sol";

contract SentinelTest is Test {
    Sentinel sentinel;
    address pvmEngine = address(0xBEEF);
    address agent = address(0xCAFE);

    // Mirror events from the contract so we can use expectEmit
    event TelemetryVerified(
        address indexed agent,
        bytes32 batchHash,
        uint256 timestamp
    );
    event TelemetryRejected(address indexed agent, bytes32 batchHash);

    function setUp() public {
        sentinel = new Sentinel(pvmEngine);
    }

    // ── verifyBatch ──────────────────────────────────────────────────────

    function test_verifyBatch_returnsTrue_whenPvmReturns01() public {
        bytes memory payload = hex"deadbeef";

        vm.mockCall(
            pvmEngine,
            payload,
            abi.encodePacked(uint8(0x01))
        );

        bool result = sentinel.verifyBatch(payload);
        assertTrue(result);
    }

    function test_verifyBatch_returnsFalse_whenPvmReturns00() public {
        bytes memory payload = hex"deadbeef";

        vm.mockCall(
            pvmEngine,
            payload,
            abi.encodePacked(uint8(0x00))
        );

        bool result = sentinel.verifyBatch(payload);
        assertFalse(result);
    }

    function test_verifyBatch_reverts_whenPvmCallFails() public {
        bytes memory payload = hex"deadbeef";

        vm.mockCallRevert(pvmEngine, payload, "");

        vm.expectRevert(Sentinel.PvmCallFailed.selector);
        sentinel.verifyBatch(payload);
    }

    // ── submitTelemetry — verified path ──────────────────────────────────

    function test_submitTelemetry_emitsVerified_andStoresHash() public {
        bytes memory payload = hex"aabbccdd";
        bytes32 batchHash = keccak256(payload);

        vm.mockCall(
            pvmEngine,
            payload,
            abi.encodePacked(uint8(0x01))
        );

        vm.prank(agent);

        vm.expectEmit(true, false, false, true);
        emit TelemetryVerified(agent, batchHash, block.timestamp);

        sentinel.submitTelemetry(payload);

        assertTrue(sentinel.isVerified(batchHash));
        assertEq(sentinel.verifiedAt(batchHash), block.timestamp);
    }

    // ── submitTelemetry — rejected path ──────────────────────────────────

    function test_submitTelemetry_emitsRejected_whenPvmReturns00() public {
        bytes memory payload = hex"aabbccdd";
        bytes32 batchHash = keccak256(payload);

        vm.mockCall(
            pvmEngine,
            payload,
            abi.encodePacked(uint8(0x00))
        );

        vm.prank(agent);

        vm.expectEmit(true, false, false, true);
        emit TelemetryRejected(agent, batchHash);

        sentinel.submitTelemetry(payload);

        assertFalse(sentinel.isVerified(batchHash));
    }

    // ── isVerified ───────────────────────────────────────────────────────

    function test_isVerified_falseByDefault() public view {
        assertFalse(sentinel.isVerified(bytes32(uint256(42))));
    }

    // ── getVerifiedBatches ───────────────────────────────────────────────

    function test_getVerifiedBatches_tracksPerAgent() public {
        bytes memory p1 = hex"11";
        bytes memory p2 = hex"22";

        vm.mockCall(pvmEngine, p1, abi.encodePacked(uint8(0x01)));
        vm.mockCall(pvmEngine, p2, abi.encodePacked(uint8(0x01)));

        vm.startPrank(agent);
        sentinel.submitTelemetry(p1);
        sentinel.submitTelemetry(p2);
        vm.stopPrank();

        bytes32[] memory batches = sentinel.getVerifiedBatches(agent);
        assertEq(batches.length, 2);
        assertEq(batches[0], keccak256(p1));
        assertEq(batches[1], keccak256(p2));
    }

    // ── setPvmEngine ─────────────────────────────────────────────────────

    function test_setPvmEngine_onlyOwner() public {
        address newEngine = address(0xDEAD);

        sentinel.setPvmEngine(newEngine);
        assertEq(sentinel.pvmEngine(), newEngine);
    }

    function test_setPvmEngine_revertsForNonOwner() public {
        vm.prank(agent);
        vm.expectRevert(Sentinel.NotOwner.selector);
        sentinel.setPvmEngine(address(0xDEAD));
    }
}

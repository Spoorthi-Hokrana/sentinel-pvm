// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Sentinel — Cryptographic coprocessor gateway for DePIN/AI telemetry
/// @author Sentinel-PVM team (Polkadot Solidity Hackathon — Track 2)
/// @notice Accepts batched ed25519 telemetry payloads from IoT/AI agents and
///         delegates signature verification to a Rust PVM contract via cross-VM call.
contract Sentinel {
    // ── State ────────────────────────────────────────────────────────────

    /// @notice Address of the Rust PVM engine that performs ed25519 verification.
    address public pvmEngine;

    /// @notice Contract owner (deployer) — can update the PVM engine address.
    address public owner;

    /// @notice Maps batch hash → true if it was verified on-chain.
    mapping(bytes32 => bool) public verified;

    /// @notice Maps batch hash → timestamp of verification.
    mapping(bytes32 => uint256) public verifiedAt;

    /// @notice Maps agent address → list of verified batch hashes.
    mapping(address => bytes32[]) private agentBatches;

    // ── Events ───────────────────────────────────────────────────────────

    /// @notice Emitted when a telemetry batch passes ed25519 verification.
    event TelemetryVerified(
        address indexed agent,
        bytes32 batchHash,
        uint256 timestamp
    );

    /// @notice Emitted when a telemetry batch fails ed25519 verification.
    event TelemetryRejected(address indexed agent, bytes32 batchHash);

    // ── Errors ───────────────────────────────────────────────────────────

    error PvmCallFailed();
    error NotOwner();

    // ── Constructor ──────────────────────────────────────────────────────

    /// @param _pvmEngine Address of the deployed Rust PVM contract.
    constructor(address _pvmEngine) {
        pvmEngine = _pvmEngine;
        owner = msg.sender;
    }

    // ── Modifiers ────────────────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // ── Core functions ───────────────────────────────────────────────────

    /// @notice Forwards a raw binary payload to the PVM engine and returns
    ///         whether all ed25519 signatures in the batch are valid.
    /// @dev    The PVM contract returns a single byte: 0x01 = all valid,
    ///         0x00 = at least one invalid. Any call failure reverts.
    /// @param  payload Binary-encoded batch (see PVM engine for format).
    /// @return result  True if every signature verified, false otherwise.
    function verifyBatch(bytes calldata payload)
        external
        returns (bool result)
    {
        (bool ok, bytes memory ret) = pvmEngine.call(payload);
        if (!ok) revert PvmCallFailed();

        result = ret.length > 0 && ret[0] == 0x01;
    }

    /// @notice Submits a telemetry batch for verification and records it.
    /// @dev    Calls verifyBatch internally; emits TelemetryVerified on
    ///         success or TelemetryRejected on signature mismatch.
    /// @param  payload Binary-encoded ed25519 signature batch.
    function submitTelemetry(bytes calldata payload) external {
        bytes32 batchHash = keccak256(payload);

        (bool ok, bytes memory ret) = pvmEngine.call(payload);
        if (!ok) revert PvmCallFailed();

        bool passed = ret.length > 0 && ret[0] == 0x01;

        if (passed) {
            verified[batchHash] = true;
            verifiedAt[batchHash] = block.timestamp;
            agentBatches[msg.sender].push(batchHash);
            emit TelemetryVerified(msg.sender, batchHash, block.timestamp);
        } else {
            emit TelemetryRejected(msg.sender, batchHash);
        }
    }

    // ── View functions ───────────────────────────────────────────────────

    /// @notice Returns true if a batch hash has been verified on-chain.
    function isVerified(bytes32 batchHash) external view returns (bool) {
        return verified[batchHash];
    }

    /// @notice Returns all verified batch hashes submitted by an agent.
    function getVerifiedBatches(address agent)
        external
        view
        returns (bytes32[] memory)
    {
        return agentBatches[agent];
    }

    // ── Admin ────────────────────────────────────────────────────────────

    /// @notice Allows the owner to update the PVM engine address after redeployment.
    function setPvmEngine(address _pvmEngine) external onlyOwner {
        pvmEngine = _pvmEngine;
    }
}

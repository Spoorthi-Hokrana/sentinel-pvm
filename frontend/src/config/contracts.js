export const SENTINEL_ADDRESS =
  import.meta.env.VITE_SENTINEL_ADDRESS ||
  "0xe52439ffc5e6875e1961cf16bea1e6906673700b";
export const PVM_ENGINE_ADDRESS =
  import.meta.env.VITE_PVM_ADDRESS ||
  "0xd67c20221ed1cc16416bd5be1915b2b9487fb1d0";

export const SENTINEL_ABI = [
  {
    inputs: [{ name: "_pvmEngine", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "NotOwner", type: "error" },
  { inputs: [], name: "PvmCallFailed", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "agent", type: "address" },
      { indexed: false, name: "batchHash", type: "bytes32" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "TelemetryVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "agent", type: "address" },
      { indexed: false, name: "batchHash", type: "bytes32" },
    ],
    name: "TelemetryRejected",
    type: "event",
  },
  {
    inputs: [{ name: "payload", type: "bytes" }],
    name: "verifyBatch",
    outputs: [{ name: "result", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "payload", type: "bytes" }],
    name: "submitTelemetry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "batchHash", type: "bytes32" }],
    name: "isVerified",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "agent", type: "address" }],
    name: "getVerifiedBatches",
    outputs: [{ name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_pvmEngine", type: "address" }],
    name: "setPvmEngine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pvmEngine",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "bytes32" }],
    name: "verified",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "bytes32" }],
    name: "verifiedAt",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export const SENTINEL_ADDRESS = '0xe52439ffc5e6875e1961cf16bea1e6906673700b';
export const PVM_ENGINE_ADDRESS = '0xd67c20221ed1cc16416bd5be1915b2b9487fb1d0';

export const SENTINEL_ABI = [
  {
    inputs: [{ name: 'payload', type: 'bytes' }],
    name: 'verifyBatch',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'payload', type: 'bytes' }],
    name: 'submitTelemetry',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'bytes32' }],
    name: 'isVerified',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'getVerifiedBatches',
    outputs: [{ name: '', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pvmEngine',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
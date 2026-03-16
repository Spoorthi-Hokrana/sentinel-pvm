# Sentinel-PVM

[![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?style=for-the-badge&logo=polkadot&logoColor=white)](https://polkadot.network)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org)

**A cryptographic coprocessor for DePIN & AI farming networks built on Polkadot Hub using PolkaVM.**

## Problem & Solution
IoT devices and AI agents in DePIN networks generate massive amounts of telemetry that require cryptographic verification. Standard EVM environments hit gas limits almost immediately when processing batch signatures or complex ZK-proofs.

**Sentinel-PVM** solves this by offloading these tasks to PolkaVM. By using `pallet-revive`, Solidity developers can leverage the performance of Rust and RISC-V to verify 1000+ signatures in a single transaction.

## Architecture
```text
[ AI Agent / IoT ] --(Signed Telemetry Batch)--> [ Sentinel.sol (EVM) ]
                                                         |
                                                 (Cross-VM Call)
                                                         |
                                                         v
[ Result (Bool) ] <--(Return Value)------------- [ PVM Engine (Rust) ]
                                                 (ed25519-dalek / Bulletproofs)
```

## Tech Stack
- **Engine**: Rust (`#![no_std]`), PolkaVM, RISC-V
- **Frontend**: React, Vite, TailwindCSS, ThirdWeb, Framer Motion
- **Contracts**: Solidity, Foundry
- **Agent**: Python, Web3.py

## Setup Instructions

### PVM Engine
```bash
cd pvm-engine
cargo build --target riscv64emac-unknown-none-polkavm
```

### Solidity Frontend
```bash
cd solidity-frontend
forge build
```

### AI Agent
```bash
cd agent
pip install cryptography web3
python agent.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## How to Run the Demo
1. Deploy the PVM contract to Paseo Testnet.
2. Update the `Sentinel.sol` with the PVM contract address.
3. Start the React frontend.
4. Run the Python `agent.py` to simulate telemetry streaming.

## Hackathon Track
**Track 2 — PVM-experiments: Call Rust libraries from Solidity**
Created for the Polkadot Solidity Hackathon on DoraHacks.

## License
MIT

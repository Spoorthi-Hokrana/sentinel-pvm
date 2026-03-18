<div align="center">

# 🌿 Sentinel-PVM

**A Stateless Rust Cryptographic Coprocessor for DePIN & AI Farming**  
*Polkadot Solidity Hackathon — Track 2: PVM Smart Contract (Call Rust Libraries from Solidity)*

[![Live on Paseo](https://img.shields.io/badge/Live-Paseo%20Testnet-E6007A?style=for-the-badge)](#deployed-contracts)
[![Rust + PolkaVM](https://img.shields.io/badge/Engine-Rust%20%2B%20PolkaVM-000000?style=for-the-badge&logo=rust&logoColor=white)](#pvm-engine-rust)
[![Solidity Gateway](https://img.shields.io/badge/Gateway-Solidity%20%2B%20Foundry-363636?style=for-the-badge&logo=ethereum&logoColor=white)](#solidity-gateway)
[![React Frontend](https://img.shields.io/badge/Dashboard-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#frontend)

</div>

---

## The Problem

Self-hosted AI farming agents and IoT drone swarms generate thousands of signed telemetry data points like soil moisture, pH levels, temperature readings, autonomous irrigation decisions. Every one of these data points needs to be cryptographically verified before it can be trusted by downstream consumers (buyers, insurance, supply chain auditors).

**EVM cannot do this.** Ed25519 is not an EVM precompile. Verifying even a single ed25519 signature in pure Solidity requires implementing Curve25519 field arithmetic inline, costing **~1.1 million gas per signature**. A batch of 10 signatures would cost **~11 million gas** which is dangerously close to block gas limits. At 15+ signatures, the transaction simply **reverts out of gas**.

This makes enterprise-scale DePIN data verification mathematically impossible on any standard EVM chain.

---

## The Solution

Sentinel-PVM uses `pallet-revive` on Polkadot Asset Hub to blend **EVM composability** with **PVM execution speed**.

A standard Solidity contract acts as the public entry point (familiar EVM tooling, standard ABI). When it receives a batch of telemetry data, it delegates the heavy ed25519 cryptographic verification to a **stateless Rust contract compiled to RISC-V PolkaVM bytecode**. The Rust contract uses the `ed25519-dalek` crate, an industry-standard cryptographic library to verify every signature at bare-metal speeds, and returns a simple boolean back to Solidity.

**The critical discovery:** We didn't need custom precompiles or special Solidity libraries. In `Sentinel.sol`, we simply wrote `pvmEngine.call(payload)`. The chain automatically bridges this standard EVM `call()` into a RISC-V execution context. The developer experience is seamless.

**Result:** 10 ed25519 signatures verified for **~95,000 gas** via PVM, compared to **~11,000,000 gas** (estimated) on pure EVM. That's a **99.1% cost reduction**. And PVM can scale well beyond 10, the only current constraint is the Paseo testnet's block weight limits (`ref_time`), not the engine itself.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Off-Chain: AI / IoT Layer                   │
│                                                                 │
│   agent.py generates telemetry → signs each reading with        │
│   ed25519 → packs into binary payload (4B header + N×128B)      │
└────────────────────────────┬────────────────────────────────────┘
                             │ submitTelemetry(bytes)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Layer 2: Solidity Gateway (Sentinel.sol)            │
│                                                                 │
│   • Accepts raw binary payload from any EVM-compatible caller   │
│   • Computes keccak256 batch hash                               │
│   • Forwards payload to PVM engine via pvmEngine.call()         │
│   • Records verification result + emits event                   │
└────────────────────────────┬────────────────────────────────────┘
                             │ Standard EVM call() → cross-VM
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           Layer 3: Rust PVM Engine (pvm_engine.polkavm)          │
│                                                                 │
│   #![no_std] Rust contract on RISC-V PolkaVM                    │
│   • Custom static bump allocator (sbrk banned by pallet-revive) │
│   • 64 KiB heap for ed25519-dalek operations                    │
│   • Parses binary: count(u32 LE) + entries(pubkey|msg|sig)      │
│   • Verifies each signature → returns 0x01 (pass) or 0x00      │
└────────────────────────────┬────────────────────────────────────┘
                             │ bool result
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Layer 4: On-Chain Resolution                    │
│                                                                 │
│   Sentinel.sol records: verified[batchHash] = true              │
│   Emits: TelemetryVerified(agent, batchHash, timestamp)         │
│   Queryable: isVerified(hash), getVerifiedBatches(address)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## PVM vs EVM Comparison

| Feature | Pure Solidity (EVM) | Sentinel-PVM (Solidity → Rust) |
|---|---|---|
| **Ed25519 precompile?** | ❌ None — must implement field math in Solidity | ✅ Native `ed25519-dalek` crate |
| **Cost for 10 signatures** | ~11,000,000 gas (estimated) | **~95,000 gas (measured)** |
| **Batch at 15+ signatures** | ❌ Reverts — exceeds block gas limit | ✅ Succeeds in a single transaction |
| **Library access** | Extremely limited, inline assembly only | Full Rust `no_std` ecosystem |
| **VM architecture** | 256-bit stack machine | 64-bit RISC-V register machine |
| **Range proofs (Bulletproofs)** | Practically impossible | Feasible via Rust crate (future work) |

---

## Deployed Contracts

Both contracts are live on the **Paseo Asset Hub Testnet** (Chain ID: `420420417`).

| Contract | Address | Explorer |
|---|---|---|
| **PVM Verification Engine** (Rust) | `0xd67c20221ed1cc16416bd5be1915b2b9487fb1d0` | [View on Subscan](https://assethub-paseo.subscan.io/account/0xd67c20221ed1cc16416bd5be1915b2b9487fb1d0) |
| **Sentinel Protocol** (Solidity) | `0xe52439ffc5e6875e1961cf16bea1e6906673700b` | [View on Subscan](https://assethub-paseo.subscan.io/account/0xe52439ffc5e6875e1961cf16bea1e6906673700b) |

---

## Repository Structure

```
sentinel-pvm/
├── pvm-engine/                  # Rust PVM coprocessor
│   ├── src/lib.rs               # Core: bump allocator + ed25519 batch verify
│   ├── Cargo.toml               # Dependencies: ed25519-dalek, pallet-revive-uapi
│   ├── pvm_engine.polkavm       # Compiled RISC-V binary (36 KB)
│   └── deploy.sh                # Deployment script using cast
│
├── solidity-frontend/           # Solidity gateway (Foundry project)
│   └── src/Sentinel.sol         # submitTelemetry, verifyBatch, isVerified
│
├── agent/                       # Python AI farming agent
│   ├── agent.py                 # Full 6-step pipeline: generate → sign → submit → verify
│   └── requirements.txt         # cryptography, web3, rich, eth-account
│
├── backend/                     # Express.js API bridge
│   └── server.js                # POST /api/run-agent, GET /api/agent-logs (real-time streaming)
│
├── frontend-next/               # React dashboard (Vite + TailwindCSS v3)
│   ├── src/pages/
│   │   ├── Landing.jsx          # Marketing landing page
│   │   ├── AppPage.jsx          # Dashboard: RunAgentPanel + TelemetryGrid + Activity
│   │   └── Technical.jsx        # Deep-dive: cost comparison, speed bars, deployed contracts
│   ├── src/components/
│   │   ├── RunAgentPanel.jsx    # Terminal output + run verification button
│   │   ├── TelemetryGrid.jsx    # Animated 10-tile sensor verification grid
│   │   ├── Navbar.jsx           # Global nav with Thirdweb ConnectButton
│   │   ├── AppShell.jsx         # App layout shell with global padding
│   │   ├── SmoothScroll.jsx     # Lenis smooth scrolling wrapper
│   │   └── CustomCursor.jsx     # Green dot follow cursor
│   └── src/hooks/
│       ├── useAgent.js          # Shared agent execution state
│       └── useReveal.js         # Framer Motion scroll abstractions
│
├── deployments.json             # Contract addresses + tx hashes + block numbers
├── .env.example                 # Required environment variables
└── vercel.json                  # Production deployment config
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python 3.10+** (for the agent)
- **Foundry** (for Solidity compilation and deployment, if redeploying)
- A funded wallet on the **Paseo Testnet** ([Get PAS tokens from the faucet](https://faucet.polkadot.io/))

### 1. Clone

```bash
git clone https://github.com/Spoorthi-Hokrana/sentinel-pvm.git
cd sentinel-pvm
```

### 2. Environment Setup

```bash
cp .env.example .env
# Fill in:
#   PRIVATE_KEY=0x...    (your Paseo testnet wallet private key)
#   RPC_URL=https://services.polkadothub-rpc.com/testnet
```

### 3. Run the Agent (Python)

This is the core demo. The agent generates 10 agricultural sensor readings, signs each with ed25519, submits the batch to the deployed Sentinel contract on Paseo, and verifies the result on-chain.

```bash
cd agent
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python3 agent.py
```

You will see a full terminal output showing:
1. Telemetry generation (sensor type, value, zone)
2. Ed25519 signing of each reading
3. Binary payload construction
4. **EVM vs PVM cost comparison table** (showing why EVM fails)
5. On-chain submission to Sentinel.sol → PVM engine verification
6. On-chain state confirmation (`isVerified: True`)

### 4. Run the Dashboard

```bash
# Terminal 1 — Backend API
cd backend
npm install && npm start      # Runs on http://localhost:3001

# Terminal 2 — Frontend
cd frontend-next
npm install && npm run dev    # Runs on http://localhost:5173
```

### 5. Redeploying Contracts (Optional)

If you need to redeploy the PVM engine or Solidity gateway:

```bash
# Deploy PVM engine
cd pvm-engine
./deploy.sh

# Deploy Sentinel.sol (using Foundry)
cd solidity-frontend
forge build
forge create src/Sentinel.sol:Sentinel \
  --constructor-args <PVM_ENGINE_ADDRESS> \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

---

## Technical Deep-Dive: What We Discovered

### 1. The `sbrk` Ban

`pallet-revive` strictly **bans the `sbrk` instruction**. This means standard Rust `no_std` allocators (including `picoalloc`, `wee_alloc`, and LLVM's built-in allocator) all fail at deployment time. 

**Our solution:** We wrote a custom **static bump allocator** over a 64 KiB `[u8; 65536]` buffer with atomic pointer advancement. Memory is never individually freed, which is fine for a single-invocation stateless coprocessor. This is a non-trivial systems engineering challenge that we solved cleanly.

```rust
const HEAP_SIZE: usize = 64 * 1024;

#[repr(align(32))]
struct Heap(UnsafeCell<[u8; HEAP_SIZE]>);

static HEAP: Heap = Heap(UnsafeCell::new([0u8; HEAP_SIZE]));
static OFFSET: AtomicUsize = AtomicUsize::new(0);
```

### 2. Standard `call()` — No Custom Mechanics Needed

The original plan assumed we'd need custom Solidity libraries or special precompile hooks to call into PVM. In reality, `pallet-revive` makes it **seamless**:

```solidity
(bool ok, bytes memory ret) = pvmEngine.call(payload);
```

That's it. The chain bridges EVM → RISC-V automatically. This is arguably the most developer-friendly cross-VM call mechanism in the blockchain ecosystem.

### 3. Block Weight Limits vs Theoretical Throughput

While PVM can theoretically handle 1,000+ signature verifications per call, the Paseo testnet currently enforces strict `ref_time` block weight limits for `pallet-revive` transactions. Each ed25519 verification consumes ~57 billion `ref_time` units. We capped our batches at 10 entries, which still conclusively proves the economic argument: **~95,000 gas via PVM vs ~11,000,000 gas on pure EVM**.

---

## Vision & Roadmap

Sentinel-PVM fundamentally proves that EVM smart contracts can scale data verification by delegating cryptography to RISC-V coprocessors. While our V1 implementation focuses on batch ed25519 verification for DePIN telemetry, our future commitment expands the core engine into a generalized ZK-lite verification layer.

### Q2 2026: Generalized Cryptography Sub-Protocol
- Implement support for `secp256r1` (P256), enabling EVM to natively verify Apple Secure Enclave & Android hardware signatures at 99% cost reduction.
- Introduce dynamic batch sizing via binary chunking to bypass standard block weight limits on asset-heavy chains.

### Q3 2026: Zero-Knowledge Range Proofs
- Integrate the `bulletproofs` Rust crate into the PVM engine.
- Allow sensors to prove their readings fall within a specific range (e.g. soil pH > 6.0) without revealing the exact data point to the public ledger, ensuring enterprise data privacy.

### Q4 2026: SDK & Plug-and-Play Integration
- Release `sentinel-pvm-sdk.sol` for one-line integration into existing DePIN projects.
- Automate deployment of isolated PVM sub-engines per project via a factory contract architecture.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **PVM Engine** | Rust `#![no_std]` + `ed25519-dalek` + `pallet-revive-uapi` + `polkavm-derive` |
| **Smart Contract** | Solidity ^0.8.20 + Foundry + Cast |
| **Compilation** | `polkatool` (ELF → `.polkavm` RISC-V bytecode) |
| **Agent** | Python 3 + `cryptography` + `web3.py` + `rich` |
| **Backend** | Express.js (API bridge for frontend → agent) |
| **Frontend** | React 18 + Vite + TailwindCSS v3 + Framer Motion + Recharts |
| **Wallet** | Thirdweb SDK (connect wallet) |
| **Network** | Paseo Asset Hub Testnet (Chain ID: 420420417) |

---

## License

MIT

---

<div align="center">

*"Every harvest deserves proof."*

**Built for the Polkadot Solidity Hackathon — Track 2: PVM Smart Contract**  
*Category: Call Rust Libraries from Solidity*

</div>

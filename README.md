<div align="center">
  <img src="https://img.shields.io/badge/Polkadot-E6007A?style=for-the-badge&logo=polkadot&logoColor=white" alt="Polkadot"/>
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust"/>
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity"/>
  <br/>
  <h1>🌾 Sentinel-PVM</h1>
  <p><b>A cryptographic coprocessor for DePIN & AI farming networks built on Polkadot Hub using PolkaVM.</b></p>
</div>

---

## ⚡ The Problem & Solution
IoT devices and AI agents in DePIN networks generate massive amounts of telemetry that require cryptographic verification. Standard EVM environments hit gas limits almost immediately when processing batch signatures or complex ZK-proofs.

**Sentinel-PVM** solves this by offloading these tasks to PolkaVM. By using `pallet-revive`, Solidity developers can leverage the blazing performance of Rust and RISC-V to verify large signature batches at a fraction of the gas cost.

## 🏗️ Architecture
```text
[ AI Agent / IoT ] --(Signed Telemetry Batch)--> [ Sentinel.sol (EVM) ]
                                                         |
                                                 (Cross-VM Call)
                                                         |
                                                         v
[ Result (Bool) ] <--(Return Value)------------- [ PVM Engine (Rust) ]
                                                 (ed25519-dalek crate)
```

## 🛠️ Tech Stack
- **Engine**: Rust (`#![no_std]`), PolkaVM, RISC-V Custom Allocators
- **Frontend**: React, Vite, TailwindCSS, ThirdWeb, Framer Motion
- **Contracts**: Solidity, Foundry
- **Agent**: Python, Web3.py

---

## 🚀 What We Did Differently (Deviations & Discoveries)

**1. No Zero-Knowledge Bulletproofs (Scope Reduction)**
The original idea mentioned supporting **both** batch ed25519 signatures and ZK Bulletproof range proofs. 
*   *What we did:* We focused entirely on the `ed25519` batch verification. Implementing both would likely overcomplicate the MVP. Proving that `ed25519-dalek` can execute cheaply via PVM completely validates the Hackathon thesis on its own.

**2. Standard EVM `call()` over custom mechanics**
The pitch mentions using "*`call_from_sol.sol` mechanics*". 
*   *What we did:* We discovered that `pallet-revive` is incredibly seamless. We didn't need custom precompiles or special Solidity libraries. In `Sentinel.sol`, we just wrote a standard low-level `pvmEngine.call(payload)`. The chain automatically bridges this EVM call into a RISC-V execution, which makes the developer experience much better than initially theorized.

**3. Testnet Block Weight Limits vs "1000+ signatures"**
The idea claimed we could verify "1000+ signatures in a single block".
*   *What we did:* In practice, we capped the `agent.py` payload to **batches of ~10**. While PVM is vastly more efficient, the Paseo Testnet currently has strict block weight limits (`ref_time`) for `pallet-revive` transactions. Even scaling back to 10 signatures perfectly proves the point though: on pure EVM 10 signatures costs ~11 million gas (which is dangerously close to failing single block limits), while our PVM engine verified all 10 for just **~95,000 gas**.

**4. Memory Allocation Pivot (`sbrk` ban)**
*   *What we did:* We hit a technical roadblock that wasn't in the original idea—`pallet-revive` strictly bans the `sbrk` instruction, meaning standard Rust `#![no_std]` allocators like `picoalloc` immediately fail to deploy. We had to pivot and write a custom static bump allocator and manually increase the VM stack size to 64KiB to give `ed25519-dalek` the memory it needed to run.

---

## 💻 Setup Instructions

### 1. PVM Engine (Rust)
```bash
cd pvm-engine
cargo build --target riscv64emac-unknown-none-polkavm
```
*Deploys using `cast send --create` utilizing the generated `.polkavm` RISC-V ELF.*

### 2. Solidity Frontend
```bash
cd solidity-frontend
forge build
```

### 3. AI Agent (Python)
The local agent streams signed test data directly to the deployed Sentinel contract.
```bash
cd agent
pip install -r requirements.txt
python agent.py
```

### 4. React Dashboard
A full UI block-explorer & telemetry grid.
```bash
cd frontend
npm install
npm run dev

# (Optional: Run the local Express API to trigger the agent remotely)
cd backend
npm install
node server.js
```

---

## 🏆 Hackathon Track
**Track 2 — PVM-experiments: Call Rust libraries from Solidity**  
*Created for the Polkadot Solidity Hackathon on DoraHacks.*

## 📄 License
MIT

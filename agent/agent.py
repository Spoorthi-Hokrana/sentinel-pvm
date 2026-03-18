#!/usr/bin/env python3
"""
Sentinel-PVM — AI Farming Agent

Simulates a DePIN agricultural agent that:
  1. Generates telemetry from IoT sensors
  2. Signs each reading with ed25519
  3. Submits the batch to the Sentinel smart contract on Paseo testnet
  4. Sentinel forwards the payload to a Rust PVM coprocessor for verification
  5. Verified batches are stored on-chain

No AI API needed — pure cryptography + web3.
"""

import hashlib
import json
import os
import random
import struct
import sys
import time
from pathlib import Path

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
from dotenv import load_dotenv
from eth_account import Account
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

console = Console()

# ── Contract addresses (Paseo Asset Hub, chain 420420417) ─────────────

SENTINEL_ADDRESS = Web3.to_checksum_address(
    "0xe52439ffc5e6875e1961cf16bea1e6906673700b"
)

SENTINEL_ABI = [
    {
        "inputs": [{"name": "payload", "type": "bytes"}],
        "name": "submitTelemetry",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [{"name": "batchHash", "type": "bytes32"}],
        "name": "isVerified",
        "outputs": [{"name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"name": "agent", "type": "address"}],
        "name": "getVerifiedBatches",
        "outputs": [{"name": "", "type": "bytes32[]"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "agent", "type": "address"},
            {"indexed": False, "name": "batchHash", "type": "bytes32"},
            {"indexed": False, "name": "timestamp", "type": "uint256"},
        ],
        "name": "TelemetryVerified",
        "type": "event",
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "agent", "type": "address"},
            {"indexed": False, "name": "batchHash", "type": "bytes32"},
        ],
        "name": "TelemetryRejected",
        "type": "event",
    },
]

# Sensor types with realistic agricultural value ranges
SENSOR_TYPES = {
    "soil_moisture": (10.0, 90.0, "%"),
    "ph_level": (4.0, 9.0, "pH"),
    "temperature": (15.0, 45.0, "°C"),
    "irrigation_trigger": (0.0, 1.0, "prob"),
}
ZONES = ["zone_A", "zone_B", "zone_C", "zone_D"]


# ── Telemetry generation ─────────────────────────────────────────────


def generate_telemetry(count: int) -> list[dict]:
    """Generate `count` simulated agricultural IoT sensor readings."""
    readings = []
    base_ts = int(time.time())
    for i in range(count):
        sensor_type = random.choice(list(SENSOR_TYPES.keys()))
        lo, hi, _ = SENSOR_TYPES[sensor_type]
        readings.append(
            {
                "sensor_id": random.randint(1, 500),
                "type": sensor_type,
                "value": round(random.uniform(lo, hi), 2),
                "timestamp": base_ts + i,
                "zone": random.choice(ZONES),
            }
        )
    return readings


# ── Cryptographic signing ────────────────────────────────────────────


def sign_telemetry(readings: list[dict]) -> tuple[bytes, list]:
    """
    Generate a fresh ed25519 keypair and sign each reading.

    Each reading is serialized to deterministic JSON, SHA-256 hashed to
    32 bytes, then signed with the agent's private key.

    Returns:
        (public_key_32B, [(message_hash_32B, signature_64B), ...])
    """
    private_key = Ed25519PrivateKey.generate()
    pub_bytes = private_key.public_key().public_bytes(
        Encoding.Raw, PublicFormat.Raw
    )

    signed = []
    for reading in readings:
        msg_json = json.dumps(reading, sort_keys=True, separators=(",", ":"))
        msg_hash = hashlib.sha256(msg_json.encode()).digest()
        sig = private_key.sign(msg_hash)
        signed.append((msg_hash, sig))

    return pub_bytes, signed


# ── Payload construction ─────────────────────────────────────────────


def build_payload(pubkey: bytes, signed_entries: list) -> bytes:
    """
    Build binary payload matching the Rust PVM contract's expected format:
      [0..4]  u32 LE — number of entries
      Per entry (128 bytes):
        [0..32]   ed25519 public key
        [32..64]  message hash
        [64..128] signature
    """
    buf = struct.pack("<I", len(signed_entries))
    for msg, sig in signed_entries:
        buf += pubkey + msg + sig
    return buf


# ── Contract submission ──────────────────────────────────────────────


def submit_to_contract(
    payload: bytes, w3: Web3, contract, account
) -> dict:
    """
    Call submitTelemetry(bytes) on Sentinel.sol.
    Signs, sends, and waits for the transaction receipt.

    Returns dict with: tx_hash, block_number, gas_used, status
    """
    nonce = w3.eth.get_transaction_count(account.address)

    console.print("  Estimating gas...", style="dim")
    gas = contract.functions.submitTelemetry(payload).estimate_gas(
        {"from": account.address}
    )
    console.print(f"  Gas estimate: [cyan]{gas:,}[/cyan]")

    tx = contract.functions.submitTelemetry(payload).build_transaction(
        {
            "from": account.address,
            "nonce": nonce,
            "gas": 600000,
            "gasPrice": w3.eth.gas_price * 2,
            "chainId": w3.eth.chain_id,
        }
    )

    signed = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    console.print(f"  Tx sent: [cyan]0x{tx_hash.hex()}[/cyan]")
    console.print("  Waiting for confirmation...", style="dim")

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

    return {
        "tx_hash": receipt.transactionHash.hex(),
        "block_number": receipt.blockNumber,
        "gas_used": receipt.gasUsed,
        "status": receipt.status,
    }


# ── EVM failure demo ─────────────────────────────────────────────────


def run_evm_failure_demo(payload: bytes, w3: Web3, account) -> None:
    """
    Demonstrate why PVM is necessary: ed25519 verification is not
    available as an EVM precompile, so pure-Solidity implementations
    would require elliptic curve arithmetic costing millions of gas.
    """
    console.print(
        "\n[bold yellow]⚔️  EVM vs PVM — Why This Matters[/bold yellow]"
    )
    n = len(payload) // 128  # entry count

    # Ed25519 verification in pure Solidity requires ~1.1M gas per
    # signature (field arithmetic on Curve25519 without a precompile).
    # Source: https://github.com/javierlinero/solidity-ed25519
    EVM_GAS_PER_SIG = 1_100_000
    evm_cost = n * EVM_GAS_PER_SIG

    tbl = Table(title="EVM vs PVM Cost Comparison", show_lines=True)
    tbl.add_column("", style="bold")
    tbl.add_column("Pure EVM (Solidity)", style="red")
    tbl.add_column("PVM (Rust/RISC-V)", style="green")
    tbl.add_row(
        "Ed25519 precompile?",
        "❌ None — must implement in Solidity",
        "✅ Native ed25519-dalek crate",
    )
    tbl.add_row(
        f"Cost for {n} sigs",
        f"~{evm_cost:,} gas (est.)",
        "Measured after submission →",
    )
    tbl.add_row(
        "Feasibility",
        "Exceeds block gas limit" if evm_cost > 30_000_000
        else "Extremely expensive",
        "Single transaction ✅",
    )
    console.print(tbl)
    console.print(
        "  [green]→ PVM offloads heavy crypto to native RISC-V, "
        "keeping costs practical.[/green]\n"
    )


# ── Main execution flow ──────────────────────────────────────────────


def main():
    # Load .env from project root (one directory up from agent/)
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if not env_path.exists():
        console.print(f"[red]✗ .env not found at {env_path}[/red]")
        sys.exit(1)
    load_dotenv(env_path)

    rpc_url = os.getenv("RPC_URL")
    private_key = os.getenv("PRIVATE_KEY")
    if not rpc_url or not private_key:
        console.print(
            "[red]✗ RPC_URL and PRIVATE_KEY must be set in .env[/red]"
        )
        sys.exit(1)

    # ── Banner ────────────────────────────────────────────────────
    console.print()
    console.print(
        Panel.fit(
            "[bold green]🌾 Sentinel-PVM — AI Farming Agent[/bold green]\n"
            "[dim]DePIN telemetry → ed25519 batch signing → "
            "on-chain PVM verification[/dim]",
            border_style="green",
        )
    )

    # ── Connect to network ────────────────────────────────────────
    console.print("\n[bold]🔗 Connecting to Paseo Asset Hub...[/bold]")
    w3 = Web3(Web3.HTTPProvider(rpc_url, request_kwargs={"timeout": 30}))
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
    if not w3.is_connected():
        console.print(f"[red]✗ Cannot connect to {rpc_url}[/red]")
        sys.exit(1)

    account = Account.from_key(private_key)
    balance = w3.eth.get_balance(account.address)
    console.print(f"  Wallet:  [cyan]{account.address}[/cyan]")
    console.print(
        f"  Balance: [green]"
        f"{w3.from_wei(balance, 'ether'):.4f} PAS[/green]"
    )
    console.print(f"  Chain:   [dim]{w3.eth.chain_id}[/dim]")

    contract = w3.eth.contract(address=SENTINEL_ADDRESS, abi=SENTINEL_ABI)

    # ── Step 1: Generate telemetry ────────────────────────────────
    # Batch size capped to ~10 entries per tx due to Polkadot Hub block
    # weight limits. Each ed25519 verification consumes ~57B ref_time;
    # block limit is ~1.4T ref_time.
    BATCH_SIZE = 10
    console.print(
        f"\n[bold]📡 Step 1 — Generating telemetry data "
        f"({BATCH_SIZE} entries)...[/bold]"
    )
    readings = generate_telemetry(BATCH_SIZE)

    table = Table(title=f"Sample Telemetry (5 of {BATCH_SIZE})")
    table.add_column("Sensor", style="cyan", justify="right")
    table.add_column("Type", style="magenta")
    table.add_column("Value", justify="right")
    table.add_column("Zone", style="green")
    table.add_column("Timestamp", style="dim")
    for r in readings[:5]:
        _, _, unit = SENSOR_TYPES[r["type"]]
        table.add_row(
            str(r["sensor_id"]),
            r["type"],
            f'{r["value"]} {unit}',
            r["zone"],
            str(r["timestamp"]),
        )
    console.print(table)

    # ── Step 2: Sign batch ────────────────────────────────────────
    console.print("\n[bold]🔐 Step 2 — Signing telemetry batch...[/bold]")
    pubkey, signed_entries = sign_telemetry(readings)
    console.print(
        f"  [green]✅ Signed {len(signed_entries)} entries "
        f"with ed25519[/green]"
    )
    console.print(
        f"  Agent public key: "
        f"[dim]{pubkey.hex()[:16]}…{pubkey.hex()[-16:]}[/dim]"
    )

    # ── Step 3: Build payload ─────────────────────────────────────
    console.print("\n[bold]📦 Step 3 — Building binary payload...[/bold]")
    payload = build_payload(pubkey, signed_entries)
    console.print(
        f"  Payload: [cyan]{len(payload):,} bytes[/cyan]  "
        f"({len(signed_entries)} × 128 B + 4 B header)"
    )

    # ── Step 4: EVM failure demo ──────────────────────────────────
    console.print(
        "\n[bold]💥 Step 4 — EVM failure demonstration...[/bold]"
    )
    try:
        run_evm_failure_demo(payload, w3, account)
    except Exception as e:
        console.print(f"  [yellow]⚠ EVM demo skipped: {e}[/yellow]\n")

    # ── Step 5: Submit to Sentinel-PVM ────────────────────────────
    console.print("[bold]🚀 Step 5 — Submitting to Sentinel-PVM...[/bold]")
    try:
        result = submit_to_contract(payload, w3, contract, account)
    except Exception as e:
        console.print(f"[red]✗ Submission failed: {e}[/red]")
        sys.exit(1)

    if result["status"] != 1:
        console.print("[red]✗ Transaction reverted on-chain[/red]")
        sys.exit(1)

    console.print("  [green]✅ Transaction confirmed![/green]")

    # ── Step 6: Verify on-chain ───────────────────────────────────
    console.print("\n[bold]🔍 Step 6 — Verifying on-chain state...[/bold]")
    batch_hash = Web3.keccak(primitive=payload)
    is_verified = contract.functions.isVerified(batch_hash).call()
    batches = contract.functions.getVerifiedBatches(
        account.address
    ).call()

    console.print(f"  Batch hash:  [cyan]0x{batch_hash.hex()}[/cyan]")
    status_color = "green" if is_verified else "red"
    console.print(
        f"  isVerified:  [{status_color}]{is_verified}[/{status_color}]"
    )
    console.print(
        f"  Agent total: [cyan]{len(batches)} verified batch(es)[/cyan]"
    )

    # ── Summary table ─────────────────────────────────────────────
    console.print()
    summary = Table(
        title="🌾 Sentinel-PVM — Run Summary",
        show_lines=True,
        border_style="green",
    )
    summary.add_column("Metric", style="bold")
    summary.add_column("Value", style="cyan")
    summary.add_row("Telemetry entries", str(len(readings)))
    summary.add_row("Payload size", f"{len(payload):,} bytes")
    summary.add_row("Tx hash", f"0x{result['tx_hash']}")
    summary.add_row("Block", str(result["block_number"]))
    summary.add_row("Gas used (PVM)", f"{result['gas_used']:,}")
    summary.add_row(
        "On-chain verified",
        "✅ Yes" if is_verified else "❌ No",
    )
    summary.add_row("Agent verified batches", str(len(batches)))
    console.print(summary)
    console.print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n[yellow]Interrupted.[/yellow]")
    except Exception as e:
        console.print(f"\n[red]✗ Fatal: {e}[/red]")
        sys.exit(1)

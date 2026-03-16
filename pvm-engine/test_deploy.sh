#!/usr/bin/env bash
# test_deploy.sh — Verify the deployed PVM contract on Paseo testnet
# Sends a hardcoded batch of 2 valid ed25519 signature entries and checks the result.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found."
  exit 1
fi

source "$ENV_FILE"

if [ -z "${PVM_CONTRACT_ADDRESS:-}" ]; then
  echo "ERROR: PVM_CONTRACT_ADDRESS not set in .env. Deploy the contract first."
  exit 1
fi

RPC_URL="${RPC_URL:-https://testnet-passet-hub-eth-rpc.polkadot.io}"

# ── Hardcoded test payload ────────────────────────────────────────────
# Format: 4-byte u32 LE count (2) + 2 entries of 128 bytes each
#   Entry = 32-byte pubkey + 32-byte message + 64-byte signature
# These are real ed25519 signatures generated from valid keypairs.
#   Entry 1: message = 0xAA repeated 32 times
#   Entry 2: message = 0xAB repeated 32 times
PAYLOAD="0x02000000fe33b44debf1d847b96d6a5c840f733118e10720460bee4a64ea86ab8721b24daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaee3f3a685f486fe56a83ade902bf63d31deb52559d5946ada07524adeb48e0da8d3bac58a4d012d7764f985512618090bf66b822a8c106f222f2c5bfb6a5540ad72bcfcf9be283074aa677049b53054db2446b936cb5d441219f65ef7bac530aababababababababababababababababababababababababababababababababc8571e06560579267a236228093d13a345384eba07fe1374b9261504c883c9afdfe700c3443a070894bf8cc625103cf8bc0ea3bd676e30a131fc4602d4fa4705"

echo "==> Calling contract at $PVM_CONTRACT_ADDRESS on $RPC_URL"
echo "    Payload: 2 ed25519 signature entries (260 bytes)"
echo ""

RESULT=$(cast call "$PVM_CONTRACT_ADDRESS" "$PAYLOAD" \
  --rpc-url "$RPC_URL" 2>&1)

echo "    Raw result: $RESULT"
echo ""

# The contract returns a single byte: 0x01 (all valid) or 0x00 (failure)
if echo "$RESULT" | grep -qi "0x01"; then
  echo "==> PASS: Contract returned 0x01 — all 2 signatures verified successfully."
elif echo "$RESULT" | grep -qi "0x00"; then
  echo "==> FAIL: Contract returned 0x00 — signature verification failed."
  exit 1
else
  echo "==> ERROR: Unexpected response from contract."
  echo "    Make sure the contract is deployed and the address is correct."
  exit 1
fi

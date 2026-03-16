#!/usr/bin/env bash
# deploy.sh — Deploy the compiled .polkavm binary to Paseo testnet via cast
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Copy .env.example and fill in your keys."
  exit 1
fi

source "$ENV_FILE"

POLKAVM_BIN="$SCRIPT_DIR/pvm_engine.polkavm"
if [ ! -f "$POLKAVM_BIN" ]; then
  echo "ERROR: $POLKAVM_BIN not found. Build the contract first."
  exit 1
fi

if [ -z "${PRIVATE_KEY:-}" ] || [ "$PRIVATE_KEY" = "0x" ]; then
  echo "ERROR: PRIVATE_KEY not set in .env"
  exit 1
fi

RPC_URL="${RPC_URL:-https://testnet-passet-hub-eth-rpc.polkadot.io}"

echo "==> Hex-encoding $POLKAVM_BIN ($(wc -c < "$POLKAVM_BIN") bytes)..."
HEX_BYTECODE="0x$(xxd -p "$POLKAVM_BIN" | tr -d '\n')"

echo "==> Deploying to Paseo testnet at $RPC_URL..."
RESULT=$(cast send --create "$HEX_BYTECODE" \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --json 2>&1)

CONTRACT_ADDR=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['contractAddress'])" 2>/dev/null || true)

if [ -z "$CONTRACT_ADDR" ]; then
  echo "Deploy output:"
  echo "$RESULT"
  echo ""
  echo "ERROR: Could not extract contract address. Check the output above."
  exit 1
fi

echo "==> Contract deployed at: $CONTRACT_ADDR"

# Update .env with the deployed address
if grep -q "^PVM_CONTRACT_ADDRESS=" "$ENV_FILE"; then
  sed -i "s|^PVM_CONTRACT_ADDRESS=.*|PVM_CONTRACT_ADDRESS=$CONTRACT_ADDR|" "$ENV_FILE"
else
  echo "PVM_CONTRACT_ADDRESS=$CONTRACT_ADDR" >> "$ENV_FILE"
fi

echo "==> Saved PVM_CONTRACT_ADDRESS=$CONTRACT_ADDR to .env"
echo "==> Done."

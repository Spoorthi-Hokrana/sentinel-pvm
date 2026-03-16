import { defineChain as viemDefineChain } from "viem";
import { createPublicClient, http } from "viem";
import { defineChain } from "thirdweb/chains";

const RPC_URL =
  import.meta.env.VITE_RPC_URL || "https://testnet-paseo-eth-rpc.polkadot.io";
const EXPLORER_URL =
  "https://blockscout-passet-hub.parity-testnet.parity.io";

export const paseoAssetHub = defineChain({
  id: 420420417,
  name: "Paseo Asset Hub",
  rpc: RPC_URL,
  nativeCurrency: { name: "PAS", symbol: "PAS", decimals: 18 },
  testnet: true,
  blockExplorers: [{ name: "Blockscout", url: EXPLORER_URL }],
});

export const paseoViem = viemDefineChain({
  id: 420420417,
  name: "Paseo Asset Hub",
  network: "paseo-asset-hub",
  nativeCurrency: { name: "PAS", symbol: "PAS", decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: EXPLORER_URL },
  },
  testnet: true,
});

export const publicClient = createPublicClient({
  chain: paseoViem,
  transport: http(RPC_URL),
});

export const EXPLORER = EXPLORER_URL;

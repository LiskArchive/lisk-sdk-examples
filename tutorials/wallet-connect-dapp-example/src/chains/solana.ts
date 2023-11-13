import { ChainsMap } from "caip-api";
import { NamespaceMetadata, ChainMetadata } from "../helpers";

// TODO: add `solana` namespace to `caip-api` package to avoid manual specification here.
export const SolanaChainData: ChainsMap = {
  "4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ": {
    id: "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ",
    name: "Solana Mainnet",
    rpc: ["https://api.mainnet-beta.solana.com", "https://solana-api.projectserum.com"],
    slip44: 501,
    testnet: false,
  },
  "8E9rvCKLFQia2Y35HXjjpWzj8weVo44K": {
    id: "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K",
    name: "Solana Devnet",
    rpc: ["https://api.devnet.solana.com"],
    slip44: 501,
    testnet: true,
  },
};

export const SolanaMetadata: NamespaceMetadata = {
  // Solana Mainnet
  "4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ": {
    logo: "/solana_logo.png",
    rgb: "0, 0, 0",
  },
  // Solana Devnet
  "8E9rvCKLFQia2Y35HXjjpWzj8weVo44K": {
    logo: "/solana_logo.png",
    rgb: "0, 0, 0",
  },
};

export function getChainMetadata(chainId: string): ChainMetadata {
  const reference = chainId.split(":")[1];
  const metadata = SolanaMetadata[reference];
  if (typeof metadata === "undefined") {
    throw new Error(`No chain metadata found for chainId: ${chainId}`);
  }
  return metadata;
}

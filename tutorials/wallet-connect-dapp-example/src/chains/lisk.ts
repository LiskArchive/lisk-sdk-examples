import { ChainsMap } from "caip-api";
import { NamespaceMetadata, ChainMetadata } from "../helpers";

// TODO: add `lisk` namespace to `caip-api` package to avoid manual specification here.
export const LiskChainData: ChainsMap = {
  "00000000": {
    id: "lisk:mainnet",
    name: "Lisk Mainnet",
    rpc: ["https://service.lisk.com"],
    slip44: 501,
    testnet: true,
  },
  "01000000": {
    id: "lisk:testnet",
    name: "Lisk Testnet",
    rpc: ["https://service.lisk.com"],
    slip44: 501,
    testnet: true,
  },
  "04000000": {
    id: "lisk:devnet",
    name: "Lisk Devnet",
    rpc: ["https://service.lisk.com"],
    slip44: 501,
    testnet: true,
  },
};

export const LiskMetadata: NamespaceMetadata = {
  // Lisk mainnet
  "00000000": {
    logo: "/solana_logo.png",
    rgb: "0, 0, 0",
  },
  // Lisk testnet
  "01000000": {
    logo: "/solana_logo.png",
    rgb: "0, 0, 0",
  },
  // Lisk devnet
  "04000000": {
    logo: "/solana_logo.png",
    rgb: "0, 0, 0",
  },
};

export function getChainMetadata(chainId: string): ChainMetadata {
  const reference = chainId.split(":")[1];
  const metadata = LiskMetadata[reference];
  if (typeof metadata === "undefined") {
    throw new Error(`No chain metadata found for chainId: ${chainId}`);
  }
  return metadata;
}

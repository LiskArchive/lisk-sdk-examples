export const DEFAULT_MAIN_CHAINS = [
  // mainnets
  "eip155:1",
  "eip155:10",
  "eip155:100",
  "eip155:137",
  "eip155:42161",
  "eip155:42220",
  "cosmos:cosmoshub-4",
  "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ",
  "lisk:10000001",
];

export const DEFAULT_TEST_CHAINS = [
  // testnets
  "eip155:42",
  "eip155:69",
  "eip155:80001",
  "eip155:421611",
  "eip155:44787",
  "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K",
  "lisk:00000000",
  "lisk:01000000",
  "lisk:04000000",
];

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS];

export const DEFAULT_PROJECT_ID = process.env.REACT_APP_PROJECT_ID;

export const DEFAULT_RELAY_URL = process.env.REACT_APP_RELAY_URL;

export const DEFAULT_LOGGER = "debug";

export const DEFAULT_APP_METADATA = {
  name: "React App",
  description: "React App for WalletConnect",
  url: "https://walletconnect.com/",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

/**
 * EIP155
 */
export enum DEFAULT_EIP155_METHODS {
  ETH_SEND_TRANSACTION = "eth_sendTransaction",
  ETH_SIGN_TRANSACTION = "eth_signTransaction",
  ETH_SIGN = "eth_sign",
  PERSONAL_SIGN = "personal_sign",
  ETH_SIGN_TYPED_DATA = "eth_signTypedData",
}

export enum DEFAULT_EIP_155_EVENTS {
  ETH_CHAIN_CHANGED = "chainChanged",
  ETH_ACCOUNTS_CHANGED = "accountsChanged",
}

/**
 * COSMOS
 */
export enum DEFAULT_COSMOS_METHODS {
  COSMOS_SIGN_DIRECT = "cosmos_signDirect",
  COSMOS_SIGN_AMINO = "cosmos_signAmino",
}

export enum DEFAULT_COSMOS_EVENTS {}

/**
 * SOLANA
 */
export enum DEFAULT_SOLANA_METHODS {
  SOL_SIGN_TRANSACTION = "solana_signTransaction",
  SOL_SIGN_MESSAGE = "solana_signMessage",
}

/**
 * LI|SK
 */
export enum DEFAULT_LISK_METHODS {
  LSK_SIGN_TRANSACTION = "sign_transaction",
  LSK_SIGN_MESSAGE = "sign_message",
}

export enum DEFAULT_SOLANA_EVENTS {}
export enum DEFAULT_LISK_EVENTS {}

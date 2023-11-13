import { apiGetChainNamespace, ChainsMap } from "caip-api";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { SolanaChainData } from "../chains/solana";
import { LiskChainData } from "../chains/lisk";

import { ChainNamespaces, getAllChainNamespaces } from "../helpers";

/**
 * Types
 */
interface IContext {
  chainData: ChainNamespaces;
}

/**
 * Context
 */
export const ChainDataContext = createContext<IContext>({} as IContext);

/**
 * Provider
 */
export function ChainDataContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const [chainData, setChainData] = useState<ChainNamespaces>({});

  const loadChainData = async () => {
    const namespaces = getAllChainNamespaces();
    const chainData: ChainNamespaces = {};
    await Promise.all(
      namespaces.map(async namespace => {
        let chains: ChainsMap | undefined;
        try {
          if (namespace === "solana") {
            chains = SolanaChainData;
          } else if (namespace === "lisk") {
            chains = LiskChainData;
          } else {
            chains = await apiGetChainNamespace(namespace);
          }
        } catch (e) {
          // ignore error
        }
        if (typeof chains !== "undefined") {
          chainData[namespace] = chains;
        }
      }),
    );

    setChainData(chainData);
  };

  useEffect(() => {
    loadChainData();
  }, []);

  return (
    <ChainDataContext.Provider
      value={{
        chainData,
      }}
    >
      {children}
    </ChainDataContext.Provider>
  );
}

export function useChainData() {
  const context = useContext(ChainDataContext);
  if (context === undefined) {
    throw new Error("useChainData must be used within a ChainDataContextProvider");
  }
  return context;
}

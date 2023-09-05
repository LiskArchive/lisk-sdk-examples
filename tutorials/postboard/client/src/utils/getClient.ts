/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@liskhq/lisk-client/browser';

let clientCache: any;
const nodeAPIURL = 'ws://localhost:7887/rpc-ws';

export const getClient = async () => {
  if (!clientCache) {
    clientCache = await apiClient.createWSClient(nodeAPIURL);
  }
  return clientCache;
};

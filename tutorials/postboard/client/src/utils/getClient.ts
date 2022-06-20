/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@liskhq/lisk-client';

let clientCache: any;
const nodeAPIURL = 'ws://localhost:8080/ws';

export const getClient = async () => {
  if (!clientCache) {
    clientCache = await apiClient.createWSClient(nodeAPIURL);
  }
  return clientCache;
};

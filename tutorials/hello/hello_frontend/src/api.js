import { apiClient } from '@liskhq/lisk-client/browser';
const RPC_ENDPOINT = 'ws://localhost:7887/rpc-ws';

let clientCache;

export const getClient = async () => {
    if (!clientCache) {
        clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
    }
    return clientCache;
};
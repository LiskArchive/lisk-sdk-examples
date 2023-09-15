const { apiClient } = require('@liskhq/lisk-client');

const RPC_ENDPOINT = 'ws://127.0.0.1:7887/rpc-ws';
let clientCache;

const getClient = async () => {
  if (!clientCache) {
    clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
  }
  return clientCache;
};

module.exports = { getClient };
 const { apiClient, transactions } = require('@liskhq/lisk-client');

const RPC_ENDPOINT = 'ws://localhost:7887/rpc-ws';
let clientCache;

const getClient = async () => {
  if (!clientCache) {
    clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
  }
  return clientCache;
};

module.exports = { getClient };

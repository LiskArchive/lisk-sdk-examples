 const { apiClient, transactions } = require('@liskhq/lisk-client');

const RPC_ENDPOINT = 'ws://localhost:8080/ws';
let clientCache;

const getClient = async () => {
  if (!clientCache) {
    clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
  }
  return clientCache;
};

module.exports = { getClient };

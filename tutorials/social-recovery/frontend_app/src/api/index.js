import { apiClient } from '@liskhq/lisk-client';

const RPC_ENDPOINT = 'ws://localhost:8888/ws';

let clientCache;

export const getClient = async () => {
  if (!clientCache) {
    clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
  }
  return clientCache;
};

export const fetchRecoveryConfigs = async () => {
  const client = await getClient();
  return client.invoke('SRSData:getAllRecoveryConfigs');
};

export const sendTransactions = async (tx, action) => {
    return fetch(`http://localhost:8080/api/recovery/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tx),
    })
      .then((res) => res.json())
      .then((res) => res);
  };

export const fetchAccountInfo = async (address) => {
    return fetch(`http://localhost:4000/api/accounts/${address}`)
      .then((res) => res.json())
      .catch((res) => res.data);
};

export const fetchNodeInfo = async () => {
  return fetch("http://localhost:4000/api/node/info")
    .then((res) => res.json())
    .catch((res) => res.data);
};

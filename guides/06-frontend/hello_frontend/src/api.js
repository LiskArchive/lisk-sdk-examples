const { apiClient, cryptography } = require('@liskhq/lisk-client');
const RPC_ENDPOINT = 'ws://localhost:8080/ws';

let clientCache;

export const getClient = async () => {
    if (!clientCache) {
        clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
    }
    return clientCache;
};

export const fetchAccountInfo = async (address) => {
    const client = await getClient();
    return client.account.get(cryptography.getAddressFromBase32Address(address));
};

export const fetchHelloCounter = async () => {
    const client = await getClient();
    return client.invoke('hello:amountOfHellos');
};

export const fetchLatestHello = async () => {
    const client = await getClient();
    return client.invoke('latestHello:getLatestHello');
};

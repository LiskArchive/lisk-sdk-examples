const { apiClient } = require('@liskhq/lisk-client');
let clientCache;
const nodeAPIURL = 'ws://localhost:7887/rpc-ws'

/**
 * Connects to a node API via WS
 *
 * @returns The API client
 */
const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

module.exports = { getClient };
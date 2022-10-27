const { apiClient } = require('@liskhq/lisk-client');

let clientCache;
const nodeAPIURL = 'ws://127.0.0.1:7887/rpc-ws'

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

getClient().then(client => {
	client.subscribe("hello_newHello", ( data ) => {
		console.log('new hello: ',data);
	});
});
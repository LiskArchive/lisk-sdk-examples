const { apiClient } = require('@liskhq/lisk-client');

let clientCache;
const nodeAPIURL = 'ws://127.0.0.1:7887/rpc-ws'

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

const blockId = "3aa6d98769865447436b6b4d06c414114334746db4bccc1975a053464105b014";

getClient().then((client) => {
	client.invoke("chain_getBlockByID", {
		id: blockId
	}).then(res => {
		console.log("Result: ", res);
	});
});
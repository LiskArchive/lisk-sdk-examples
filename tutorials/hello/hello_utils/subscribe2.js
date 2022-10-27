const { apiClient } = require('@liskhq/lisk-client');

/*let clientCache;
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
});*/

const runWSClient = async () => {
	const wsClient =  await apiClient.createWSClient('ws://127.0.0.1:7887/rpc-ws');
	wsClient.subscribe('chain_newBlock', data => console.log('New Block:', data));
	console.log('NodeInfo:', await wsClient.node.getNodeInfo());
	console.log('Block at height 2', await wsClient.block.getByHeight(2));
	console.log('Events at height 2', await wsClient.invoke('chain_getEvents', { height: 2 }));
	// Invoke app or module related RPCs
	console.log('Get voter:', await wsClient.invoke('dpos_getVoter', { address: 'lske5sqed53fdcs4m9et28f2k7u9fk6hno9bauday' }));
}

runWSClient();
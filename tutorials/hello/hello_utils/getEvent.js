const { apiClient, codec } = require('@liskhq/lisk-client');

let clientCache;
const nodeAPIURL = 'ws://127.0.0.1:7887/rpc-ws'

const newHelloEventSchema = {
	$id: '/hello/events/new_hello',
	type: 'object',
	required: ['senderAddress', 'message'],
	properties: {
		senderAddress: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		message: {
			dataType: 'string',
			fieldNumber: 2,
		},
	},
};

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

getClient().then((client) => {
	client.invoke("chain_getEvents", {
		height: 1014
	}).then(res => {
		console.log("Result: ", res);
		const newHello = codec.codec.decode(newHelloEventSchema,res[2].data);
		console.log("newHello: ", newHello);
	});
});
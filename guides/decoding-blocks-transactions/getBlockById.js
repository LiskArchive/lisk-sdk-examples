const { apiClient } = require('@liskhq/lisk-client');
let clientCache;
const nodeAPIURL = 'ws://localhost:8080/ws';

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

if (process.argv.length < 3) {
	console.error("Please provide the block ID to be decoded.")
	process.exit(1);
}
const blockId = process.argv[2];


getClient().then((client) => {
	client.invoke("app:getBlockByID", {
		id: blockId
	}).then(res => {
		console.log(res);
		const blockObject = client.block.decode(res);
		const blockJSON = client.block.toJSON(blockObject);
		console.log(blockJSON);
		if (blockJSON.payload && blockJSON.payload.length > 0) {
			console.log(blockJSON.payload[0].asset);
		}
		process.exit(0);
	});
});
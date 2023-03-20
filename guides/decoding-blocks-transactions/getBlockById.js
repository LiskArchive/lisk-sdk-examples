const { apiClient } = require('@liskhq/lisk-client');
let clientCache;
const nodeAPIURL = 'ws://localhost:7887/rpc-ws';

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
	client.invoke("chain_getBlockByID", {
		id: blockId
	}).then(res => {
		const blockObject = client.block.fromJSON(res);
		const encodedBlockObject = client.block.encode(blockObject);
		const encodedBlockAsHexString = encodedBlockObject.toString('hex');
		console.log("Block(JSON): ", res)
		console.log("Block(Object): ", blockObject);
		console.log("Block(Buffer): ", encodedBlockObject);
		console.log("Block(Hex String): ", encodedBlockAsHexString)
		process.exit(0);
	}).catch(err => {
		console.log("Error: ", err);
		process.exit(1);
	});
});

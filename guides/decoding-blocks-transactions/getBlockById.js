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
		const decodedBlock = client.block.decode(res);
		const blockJSON = client.block.toJSON(decodedBlock);
		const blockBuffer = client.block.fromJSON(blockJSON);
		const encodedBlockAsBuffer = client.block.encode(blockBuffer);
		const encodedBlockAsHexString = encodedBlockAsBuffer.toString('hex');
		console.log("Encoded block: ", res)
		console.log("Decoded block: ", decodedBlock);
		console.log("Block as JSON: ", blockJSON);
		if (blockJSON.payload && blockJSON.payload.length > 0) {
			console.log(blockJSON.payload[0].asset);
		}
		console.log("Block from JSON to Buffer: ", blockBuffer);
		console.log("Encoded block as Buffer: ", encodedBlockAsBuffer);
		console.log("Encoded block as hex string: ", encodedBlockAsHexString)
		console.log("res = encodedBlockAsHexString? - ", (res == encodedBlockAsHexString));
		process.exit(0);
		});
	});

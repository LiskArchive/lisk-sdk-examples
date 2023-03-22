const { getClient } = require('./api-client');
const assert = require("assert");

if (process.argv.length < 3) {
	console.error("Please provide the block ID to be decoded.")
	process.exit(1);
}
const blockId = process.argv[2];

getClient().then((client) => {
	// Returns the block
	client.invoke("chain_getBlockByID", {
		id: blockId
	}).then(block => {
		// Decoded block as Object
		const blockObject = client.block.fromJSON(block);
		// Decoded block as JSON
		const jsonBlock = client.block.toJSON(blockObject);
		// Encoded block as Buffer
		const encodedBlock = client.block.encode(blockObject);
		// Decoded block as Object
		const decodedBlock = client.block.decode(encodedBlock);
		// Encoded block as Hex String
		const blockHexString = encodedBlock.toString('hex');
		console.log("Block: ", block);
		console.log("Decoded Block(Object): ", blockObject);
		console.log("Decoded Block(JSON): ", jsonBlock)
		console.log("Encoded Block(Buffer): ", encodedBlock);
		console.log("Encoded Block(Hex String): ", blockHexString);
		const checkEqual = !assert.deepStrictEqual(blockObject, decodedBlock);
		console.log("blockObject = decodedBlock? - ", checkEqual);
		process.exit(0);
	}).catch(err => {
		console.log("Error: ", err);
		process.exit(1);
	});
});

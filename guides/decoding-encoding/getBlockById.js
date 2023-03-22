const { getClient } = require('./api-client');
const assert = require("assert");

if (process.argv.length < 3) {
	console.error("Please provide the block ID to be decoded.")
	process.exit(1);
}
const blockId = process.argv[2];

getClient().then((client) => {
	// Returns the block in JSON format
	client.invoke("chain_getBlockByID", {
		id: blockId
	}).then(block => {
		// Block as object
		const blockObject = client.block.fromJSON(block);
		// Block as JSON
		const jsonBlock = client.block.toJSON(blockObject);
		// Encode block object to Buffer
		const encodedBlock = client.block.encode(blockObject);
		// Decode block from Buffer to object
		const decodedBlock = client.block.decode(encodedBlock);
		// Block as Hex String
		const blockHexString = encodedBlock.toString('hex');
		console.log("Block: ", block);
		console.log("Block(Object): ", blockObject);
		console.log("Block(JSON): ", jsonBlock)
		console.log("Block(Buffer): ", encodedBlock);
		console.log("Block(Hex String): ", blockHexString);
		console.log("blockObject = decodedBlock? - ", assert.deepStrictEqual(blockObject,decodedBlock));
		process.exit(0);
	}).catch(err => {
		console.log("Error: ", err);
		process.exit(1);
	});
});

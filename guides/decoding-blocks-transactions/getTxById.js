const { apiClient } = require('@liskhq/lisk-client');
const assert = require("assert");
let clientCache;
const nodeAPIURL = 'ws://localhost:7887/rpc-ws';

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

if (process.argv.length < 3) {
	console.error("Please provide the transaction ID to be decoded.")
	process.exit(1);
}
const txId = process.argv[2];

getClient().then((client) => {
	// Returns the transaction in JSON format
	client.invoke("chain_getTransactionByID", {
		id: txId
	}).then(tx => {
		// Transaction as Object
		const txObject = client.transaction.fromJSON(tx);
		// Transaction as JSON
		const jsonTx = client.transaction.toJSON(txObject);
		// Encode transaction Object to Buffer
		const encodedTx = client.transaction.encode(txObject);
		// Transaction as Hex String
		const txHexString = encodedTx.toString('hex');
		// Decode transaction from Hex String to Object
		const decodedTx = client.transaction.decode(txHexString);
		console.log("Transaction: ", tx)
		console.log("Transaction(Object): ", txObject);
		console.log("Transaction(JSON): ", jsonTx)
		console.log("Transaction(Buffer): ", encodedTx);
		console.log("Transaction(Hex String): ", txHexString);
		console.log("txObject = decodedTx? - ", assert.deepStrictEqual(txObject, decodedTx));
		process.exit(0);
	}).catch(err => {
		console.log("Error: ", err);
		process.exit(1);
	});
});

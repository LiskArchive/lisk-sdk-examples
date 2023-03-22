const { getClient } = require('./api-client');
const assert = require("assert");

if (process.argv.length < 3) {
	console.error("Please provide the transaction ID to be decoded.")
	process.exit(1);
}
const txId = process.argv[2];

getClient().then((client) => {
	// Returns the transaction
	client.invoke("chain_getTransactionByID", {
		id: txId
	}).then(tx => {
		// Decoded transaction as Object
		const txObject = client.transaction.fromJSON(tx);
		// Decoded transaction as JSON
		const jsonTx = client.transaction.toJSON(txObject);
		// Encoded transaction as Buffer
		const encodedTx = client.transaction.encode(txObject);
		// Encoded transaction as Hex String
		const txHexString = encodedTx.toString('hex');
		// Decode transaction from Hex String to Object
		const decodedTx = client.transaction.decode(txHexString);
		console.log("Transaction: ", tx)
		console.log("Decoded transaction(Object): ", txObject);
		console.log("Decoded transaction(JSON): ", jsonTx)
		console.log("Encoded transaction(Buffer): ", encodedTx);
		console.log("Encoded transaction(Hex String): ", txHexString);
		const checkEqual = !assert.deepStrictEqual(txObject, decodedTx);
		console.log("txObject = decodedTx? - ", checkEqual);
		process.exit(0);
	}).catch(err => {
		console.log("Error: ", err);
		process.exit(1);
	});
});

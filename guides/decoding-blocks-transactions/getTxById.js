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
	console.error("Please provide the transaction ID to be decoded.")
	process.exit(1);
}
const txId = process.argv[2];

getClient().then((client) => {
	client.invoke("app:getTransactionByID", {
		id: txId
	}).then(res => {
		const decodedTx = client.transaction.decode(res);
		const txJSON = client.transaction.toJSON(decodedTx);
		const txBuffer = client.transaction.fromJSON(txJSON);
		const encodedTxAsBuffer = client.transaction.encode(txBuffer)
		const encodedTxAsHexString = encodedTxAsBuffer.toString('hex')
		console.log("Encoded tx: ", res)
		console.log("Decoded tx: ", decodedTx);
		console.log("Tx as JSON: ", txJSON);
		console.log("Tx from JSON to Buffer: ", txBuffer);
		console.log("Re-encoded tx: ", encodedTxAsBuffer);
		console.log("Encoded tx as hex string: ", encodedTxAsHexString)
		console.log("res = encodedTxAsHexString? - ", (res == encodedTxAsHexString));
		process.exit(0);
	});
});

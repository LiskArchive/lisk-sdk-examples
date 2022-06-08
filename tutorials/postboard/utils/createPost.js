const { apiClient, transactions } = require('@liskhq/lisk-client');
let clientCache;
const nodeAPIURL = 'ws://localhost:8080/ws';

// Replace with the sender address
const senderAddress = "3eeb3441c192bcb4096466a20ce75a912063ab8e";
// Replace with the sender passphrase
const passphrase = "uncle cream salute rail grid ketchup teach release puzzle twice mad rookie"

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

getClient().then(async (client) => {
	const tx = await client.transaction.create({
		moduleID: 1000,
		assetID: 0,
		fee: BigInt(transactions.convertLSKToBeddows('0.1')),
		asset: {
			message: 'Happy birthday!'
		}
	}, passphrase);


	console.log("Transaction object: ", tx);

	const res = await client.transaction.send(tx);
	console.log(res);
	process.exit(0);
});
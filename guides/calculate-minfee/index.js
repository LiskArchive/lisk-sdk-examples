const { apiClient, transactions } = require('@liskhq/lisk-client');

let clientCache;
const nodeAPIURL = 'ws://localhost:7887/rpc-ws'

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

const calcMinFee = async (client) => {
	const tx = {
		module: 'token',
		command: 'transfer',
		senderPublicKey: '1234567890123456789012345678901234567890123456789012345678901234',
		nonce: 0,
		fee: 0,
		params: {
			data: "Hello World!"
		}
	};

	return client.transaction.computeMinFee(tx);
}

getClient().then(client => {
	calcMinFee(client).then(minFee => {
		console.log("The minimum fee for the given transaction is: ", minFee, " Beddows, i.e. ", transactions.convertBeddowsToLSK(minFee.toString()), " LSK.");
		process.exit(0);
	})
}).catch(error => {
	console.log("Error: " + error);
	process.exit(1);
});


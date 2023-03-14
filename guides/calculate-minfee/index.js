const { apiClient, transactions } = require('@liskhq/lisk-client');

let clientCache;
const nodeAPIURL = 'ws://localhost:7887/rpc-ws'

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

// Paste the passphrase of sender account here
//const passphrase = '';

const calcMinFee = async (client) => {
	console.log(client);
	const tx = await client.transaction.create({
		module: 'token',
		command: 'transfer',
		//fee: BigInt(transactions.convertLSKToBeddows("1")),
		params: {
			message: "Hello World!"
		}
	});

	return client.transaction.computeMinFee(tx);
}

getClient().then(client => {
	calcMinFee(client).then(minFee => {
		console.log("The minimum fee for the given transaction is: ", minFee, " Beddows");
	})
})


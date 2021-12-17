const { apiClient, transactions } = require('@liskhq/lisk-client');

let clientCache;
const nodeAPIURL = 'ws://localhost:8080/ws'

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

// Paste the passphrase of sender account here
const passphrase = '';

const calcMinFee = async (client) => {
	const signedTxWithSomeFee = await client.transaction.create({
		moduleID: 1000,
		assetID: 0,
		fee: BigInt(transactions.convertLSKToBeddows("1")),
		asset: {
			helloString: "Hello World!"
		}
	}, passphrase);

	return client.transaction.computeMinFee(signedTxWithSomeFee);
}

const postTx = async (client, minFee) => {
	const signedTx = await client.transaction.create({
		moduleID: 1000,
		assetID: 0,
		fee: minFee,
		asset: {
			helloString: "Hello World!"
		}
	}, passphrase);

	return client.transaction.send(signedTx).then(res => {
		return res;
	});
}

getClient().then(client => {
	calcMinFee(client).then(minFee => {
		console.log("Minimum fee: ", minFee);
		postTx(client, minFee).then((res) => {
			console.log(res);
			process.exit(0);
		});
	})
})


const { apiClient, transactions } = require('@liskhq/lisk-client');

let clientCache;
const nodeAPIURL = 'ws://localhost:7887/rpc-ws'

// Connects to a node API
const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

// Transaction to calculate the minimum fee for
const tx = {
	module: 'token',
	command: 'transfer',
	senderPublicKey: '1234567890123456789012345678901234567890123456789012345678901234',
	nonce: 0,
	fee: 0,
	params: {
		amount:100000000,
		tokenID: "0300000000000000",
		recipientAddress: "lskycz7hvr8yfu74bcwxy2n4mopfmjancgdvxq8xz",
		data: "Hello World!"
	}
};

// Calculate and return the minimum fee
getClient().then(client => {
	const minFee = client.transaction.computeMinFee(tx);
	console.log("The minimum fee for the given transaction is: ", minFee, " Beddows, i.e. ", transactions.convertBeddowsToLSK(minFee.toString()), " LSK.");
	process.exit(0);
}).catch(error => {
	console.log("Error: " + error);
	process.exit(1);
});


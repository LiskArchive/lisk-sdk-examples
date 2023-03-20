const { apiClient, transactions } = require('@liskhq/lisk-client');

let clientCache;
const nodeAPIURL = 'ws://localhost:7887/rpc-ws'
// Example account credentials
const account = {
	"passphrase": "chalk story jungle ability catch erupt bridge nurse inmate noodle direct alley",
	"privateKey": "713406a2cf2bdf6b951c1bcba85d44eddbc06d003e8d3faf433b22be28333d97840c66741a76f936bed0a4c308e4f670156e1e1f6b91640bb8d3dd0ae2b3581e",
	"publicKey": "840c66741a76f936bed0a4c308e4f670156e1e1f6b91640bb8d3dd0ae2b3581e",
	"binaryAddress": "85c12d39041bc09e1f89dfeffe4b87cfcfe79fb2",
	"address": "lskuwzrd73pc8z4jnj4sgwgjrjnagnf8nhrovbwdn"
};

// Connects to a node API
const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

// Transaction to calculate the minimum fee for
let txJSON = {
	module: 'token',
	command: 'transfer',
	senderPublicKey: account.publicKey,
	nonce: "0",
	fee: "0",
	params: {
		amount:"100000000",
		tokenID: "0300000800000000",
		recipientAddress: "lskycz7hvr8yfu74bcwxy2n4mopfmjancgdvxq8xz",
		data: "Hello World!"
	}
};

// Calculate and return the minimum fee
getClient().then(client => {
	const minFee = client.transaction.computeMinFee(txJSON);
	console.log("The minimum fee for the given transaction is: ", minFee, " Beddows, i.e. ", transactions.convertBeddowsToLSK(minFee.toString()), " LSK.");

	const txWithFee = {
		...txJSON,
		fee: minFee.toString()
	}
	console.log("txJSONWithFee: ", txWithFee);

	const tx = client.transaction.fromJSON(txWithFee);
	console.log("tx: ", tx);
	//const encodedTx = client.transaction.encode(tx);
	//console.log("encodedTx: ", encodedTx);

	client.invoke('txpool_dryRunTransaction',{"transaction":tx.toString("hex") }).then(res => {
		console.log("Dry-un result: ", res);
		process.exit(0);
	}).catch(err => {
		console.log("Error1: " + err);
		process.exit(1);
	});
}).catch(error => {
	console.log("Error2: " + error);
	process.exit(1);
});


const { apiClient } = require('@liskhq/lisk-client');
let clientCache;
const nodeAPI = 'ws://localhost:8080/ws';

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPI);
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
		console.log(res);
		const txObject = client.transaction.decode(res);
		const txJSON = client.transaction.toJSON(txObject);
		console.log(txJSON);
		process.exit(0);
	});
});

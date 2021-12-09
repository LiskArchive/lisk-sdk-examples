const { apiClient } = require('@liskhq/lisk-client');
let clientCache;
//const txId = "130227fa63ac60edbbacb6dae709cf9304ab0181ef7ea28105764f6240d012f2";

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient('ws://localhost:8080/ws');
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
		console.log(client.transaction.decode(res));
		process.exit(0);
	});
});

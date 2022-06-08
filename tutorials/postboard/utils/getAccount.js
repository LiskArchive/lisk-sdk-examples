const { apiClient } = require('@liskhq/lisk-client');
let clientCache;
const nodeAPIURL = 'ws://localhost:8080/ws';

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

getClient().then((client) => {
	client.invoke("app:getAccount", {
		address: "3eeb3441c192bcb4096466a20ce75a912063ab8e"
		// address: "048246c3de926550485fb4d4077ba39a25656fec"
	}).then(res => {
		console.log(res);
		const accObject = client.account.decode(res);
		const accJSON = client.account.toJSON(accObject);
		console.log(accJSON);
	});
});
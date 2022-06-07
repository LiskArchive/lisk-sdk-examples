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
		address: "820d0240f0ce386f214a6449500a01d5855119e3"
	}).then(res => {
		console.log(res);
		const accObject = client.account.decode(res);
		const accJSON = client.account.toJSON(accObject);
		console.log(accJSON);
	});
});
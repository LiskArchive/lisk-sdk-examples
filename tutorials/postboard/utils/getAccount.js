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
		address: "52f7e743004b5b46d78e8850d2d821cd4ed864bd"
		// address: "5492d2a79c05b9b0c6f367afa5e98730838bcf55"
	}).then(res => {
		console.log(res);
		const accObject = client.account.decode(res);
		const accJSON = client.account.toJSON(accObject);
		console.log(accJSON);
	});
});
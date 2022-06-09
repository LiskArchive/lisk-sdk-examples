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
	client.invoke("post:getLatestPosts", {
		account: "3eeb3441c192bcb4096466a20ce75a912063ab8e"
		// id: "9ee0e2d8d50003ed3ed3eba5c6bb9a1d1f332a7d6e924827887ac5244680588e"
	}).then(res => {
		console.log(res);
		// console.log(res.replies[0].author);
		/*		const accObject = client.account.decode(res);
				const accJSON = client.account.toJSON(accObject);
				console.log(accJSON); */
	});
});
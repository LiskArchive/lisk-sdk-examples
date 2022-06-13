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
	client.invoke("userTracker:createUserList", {
		"topic":"WAD 2022 Berlin",
		"addresses":[
			"3eeb3441c192bcb4096466a20ce75a912063ab8e",
			"048246c3de926550485fb4d4077ba39a25656fec",
			"0671fedf719363707ab2fa74d2630ee372439474"
		]
	}).then(res => {
		console.log(res);
		// console.log(res.replies[0].author);
		/*		const accObject = client.account.decode(res);
				const accJSON = client.account.toJSON(accObject);
				console.log(accJSON); */
	});
});
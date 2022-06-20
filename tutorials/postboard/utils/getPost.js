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
	client.invoke("post:getPost", {
		// id: "d323314a5a0d1217c7cc90b29e46e3a402f03d51cb557cd7b51aaba90ee2e56c"
		id: "5a314502fd7647be49b594ead9057426198ebabb8380b128596816bf7cfa5653"
	}).then(res => {
		console.log(res);
		// console.log(res.replies[0].author);
/*		const accObject = client.account.decode(res);
		const accJSON = client.account.toJSON(accObject);
		console.log(accJSON); */
	});
});
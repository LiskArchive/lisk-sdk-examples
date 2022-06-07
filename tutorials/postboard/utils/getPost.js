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
		// id: "a23f361b7b4efdd5faa1d19fd232ab61a50a845bba99eeec1fd5db89c6615624"
		id: "14eb6024aef0730ac814e4af58e530005ad1cf256d9a7a34b06dbf1818d17973"
	}).then(res => {
		console.log(res);
		// console.log(res.replies[0].author);
/*		const accObject = client.account.decode(res);
		const accJSON = client.account.toJSON(accObject);
		console.log(accJSON); */
	});
});
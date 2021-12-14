import { apiClient } from "@liskhq/lisk-client";

let clientCache;
const nodeAPIURL = 'ws://localhost:8080/ws'

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

const account = {};
account.passphrase = '';

const execute = async () => {
	const client = await getClient();

	const signedTxWithSomeFee = await client.transaction.create({
		moduleID: 1000,
		assetID: 0,
		fee: BigInt(transactions.convertLSKToBeddows("1")),
		asset: {
			helloString: "Hello World!"
		}
	}, account.passphrase);

	const minFee = client.transaction.computeMinFee(signedTxWithSomeFee);

	const signedTx = await client.transaction.create({
		moduleID: 1000,
		assetID: 0,
		fee: minFee,
		asset: {
			helloString: "Hello World!"
		}
	}, account.passphrase);

	return client.transaction.send(signedTx).then(res => {
		return res;
	});
}
execute().then((res) => {
	console.log(res);
});

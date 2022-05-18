const { apiClient, cryptography, transactions } = require('@liskhq/lisk-client');
let clientCache;
const nodeAPIURL = 'ws://localhost:8080/ws';
// Replace with the sender address
const senderAddress = "lskt8ovj2shbxrtno8xqqt7cnmzzygdkbt6brnvmj";
// Replace with the sender passphrase
const passphrase = "wait yellow stage simple immune primary when digital bounce coin draft life"

const getClient = async () => {
	if (!clientCache) {
		clientCache = await apiClient.createWSClient(nodeAPIURL);
	}
	return clientCache;
};

getClient().then(async (client) => {
    const address = cryptography.getAddressFromBase32Address(senderAddress);
    const tx = await client.transaction.create({
        moduleID: 2,
        assetID: 0,
        fee: BigInt(transactions.convertLSKToBeddows('0.01')),
        asset: {
            amount: BigInt(transactions.convertLSKToBeddows('8')),
            recipientAddress: address,
            data: 'Happy birthday!'
        }
    }, passphrase);

	client.invoke("app:postTransaction", {
		transaction: client.transaction.encode(tx).toString('hex')
	}).then(res => {
		console.log("Response: ", res);
		process.exit(0);
	});
}).catch(err => {
	console.log("Error: ", err);
	process.exit(1);
});

const { apiClient, cryptography, transactions } = require('@liskhq/lisk-client');
const RPC_ENDPOINT = 'ws://localhost:8080/ws';

let clientCache;

// Replace with the sender address
const senderAddress = "lskt8ovj2shbxrtno8xqqt7cnmzzygdkbt6brnvmj";
// Replace with the sender passphrase
const passphrase = "wait yellow stage simple immune primary when digital bounce coin draft life"

const getClient = async () => {
    if (!clientCache) {
        clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
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

  console.log("Transaction object: ", tx);
  console.log("Transaction as JSON compatible object: ", client.transaction.toJSON(tx));
  console.log("Transaction binary hex string: ", client.transaction.encode(tx).toString('hex'));
  //const res = await client.transaction.send(tx);
  //console.log(res);
  process.exit(0);
});

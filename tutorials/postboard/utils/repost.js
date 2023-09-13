const {
  apiClient,
  cryptography,
  transactions
} = require('@liskhq/lisk-client');
const fs = require("fs");

const privateKey = JSON.parse(fs.readFileSync("./privateKey.json", "utf-8")).privateKey;

const getClient = async () => {
  if (!clientCache) {
    clientCache = await apiClient.createIPCClient(`~/.lisk/postboard`);
  }
  return clientCache;
};

const sendTransaction = async (nonce) => {
  const client = await getClient();

  const tx = await client.transaction.create({
    module: 'post',
    command: 'repost',
    nonce: nonce,
    fee: BigInt(transactions.convertLSKToBeddows('0.02')),
    params: {
      postId: "d62265b6b247c22934633aefa46ace425961727917d703c37826fd6a13b8dfdf",
    }
  }, privateKey);

  console.log(`nonce=${nonce}: Sending`);
  await client.transaction.send(tx);
};

let clientCache;
(async () => {
  const client = await getClient();
  let { nonce } = await client.invoke('auth_getAuthAccount', {
    address: cryptography.address.getLisk32AddressFromAddress(cryptography.address.getAddressFromPrivateKey(Buffer.from(privateKey, 'hex'))),
  });

  nonce = BigInt(nonce);
  console.log("Starting nonce:", nonce);

  await sendTransaction(nonce);
  process.exit(0);
})();

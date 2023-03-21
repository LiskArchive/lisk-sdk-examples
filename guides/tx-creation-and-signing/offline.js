const { validator, transactions } = require('@liskhq/lisk-client');
const { transactionSchema, transferParamsSchema } = require('./schemas');
const { getClient } = require('./api-client')

// Example account credentials
const account = {
  "passphrase": "chalk story jungle ability catch erupt bridge nurse inmate noodle direct alley",
  "privateKey": "713406a2cf2bdf6b951c1bcba85d44eddbc06d003e8d3faf433b22be28333d97840c66741a76f936bed0a4c308e4f670156e1e1f6b91640bb8d3dd0ae2b3581e",
  "publicKey": "840c66741a76f936bed0a4c308e4f670156e1e1f6b91640bb8d3dd0ae2b3581e",
  "binaryAddress": "85c12d39041bc09e1f89dfeffe4b87cfcfe79fb2",
  "address": "lskuwzrd73pc8z4jnj4sgwgjrjnagnf8nhrovbwdn"
};

// Create the unsigned transaction manually
const unsignedTransaction = {
  module: "token",
  command: "transfer",
  fee: BigInt(10000000),
  nonce: BigInt(23),
  senderPublicKey: Buffer.from(account.publicKey,'hex'),
  params: Buffer.alloc(0),
  signatures: [],
};

// Validate the transaction
const transactionErrors = validator.validator.validate(transactionSchema, unsignedTransaction);

if (transactionErrors && transactionErrors.length) {
  throw new validator.LiskValidationError([...transactionErrors]);
}

// Create the asset for the Token Transfer transaction
const transferParams = {
  tokenID: Buffer.from('0000000000000000','hex'),
  amount: BigInt(2000000000),
  recipientAddress: Buffer.from(account.binaryAddress,'hex'),
  data: 'Happy birthday!'
};

// Add the transaction asset to the transaction object
unsignedTransaction.params = transferParams;

console.log(unsignedTransaction);
/*
{
  module: 'token',
  command: 'transfer',
  fee: 10000000n,
  nonce: 23n,
  senderPublicKey: <Buffer 84 0c 66 74 1a 76 f9 36 be d0 a4 c3 08 e4 f6 70 15 6e 1e 1f 6b 91 64 0b b8 d3 dd 0a e2 b3 58 1e>,
  params: {
    tokenID: <Buffer 00 00 00 00 00 00 00 00>,
    amount: 2000000000n,
    recipientAddress: <Buffer 85 c1 2d 39 04 1b c0 9e 1f 89 df ef fe 4b 87 cf cf e7 9f b2>,
    data: 'Happy birthday!'
  },
  signatures: []
}
*/

// Sign the transaction
const chainID = '00000000';

const signedTransaction = transactions.signTransaction(
  unsignedTransaction,
  Buffer.from(chainID, 'hex'),
  Buffer.from(account.privateKey,'hex'),
  transferParamsSchema
);

console.log(signedTransaction);
/*
{
  module: 'token',
  command: 'transfer',
  fee: 10000000n,
  nonce: 23n,
  senderPublicKey: <Buffer 84 0c 66 74 1a 76 f9 36 be d0 a4 c3 08 e4 f6 70 15 6e 1e 1f 6b 91 64 0b b8 d3 dd 0a e2 b3 58 1e>,
  params: {
    tokenID: <Buffer 00 00 00 00 00 00 00 00>,
    amount: 2000000000n,
    recipientAddress: <Buffer 85 c1 2d 39 04 1b c0 9e 1f 89 df ef fe 4b 87 cf cf e7 9f b2>,
    data: 'Happy birthday!'
  },
  signatures: [
    <Buffer c4 9c c0 7a 53 f9 79 8e c6 29 b5 08 2c a3 c5 e6 c9 22 a7 7b 40 84 f2 53 67 e4 53 9d 35 49 ca b7 ef fd 93 84 1e 3d 6b a6 aa 7d 7a d7 26 35 d7 fd d6 9d ... 14 more bytes>
  ],
  id: <Buffer a0 a8 07 5e 9b 6f 51 6f c2 78 fb ac bb bb d6 d3 66 10 89 5d ae e4 a7 d6 7b a5 79 dd c3 a6 86 c0>
}
*/
getClient().then(client => {
  const encTx = client.transaction.encode(signedTransaction);
  client.invoke('txpool_dryRunTransaction',{"transaction":encTx.toString("hex") }).then(res => {
    console.log("Dry-un result: ", res);
    process.exit(0);
  }).catch(err => {
    console.log("Error1: " + err);
    process.exit(1);
  });
});
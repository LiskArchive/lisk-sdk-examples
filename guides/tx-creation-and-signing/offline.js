const { validator, transactions } = require('@liskhq/lisk-client');
const { transactionSchema, transferParamsSchema } = require('./schemas');

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
  amount: BigInt(2000000000),
  recipientAddress: Buffer.from(account.binaryAddress,'hex'),
  data: 'Happy birthday!'
};

// Add the transaction asset to the transaction object
unsignedTransaction.params = transferParams;

console.log(unsignedTransaction);
/*
{
  moduleID: 2,
  assetID: 0,
  nonce: 1n,
  fee: 10000000n,
  senderPublicKey: <Buffer 84 0c 66 74 1a 76 f9 36 be d0 a4 c3 08 e4 f6 70 15 6e 1e 1f 6b 91 64 0b b8 d3 dd 0a e2 b3 58 1e>,
  asset: {
    amount: 20n,
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
  moduleID: 2,
  assetID: 0,
  fee: 10000000n,
  nonce: 23n,
  senderPublicKey: <Buffer 84 0c 66 74 1a 76 f9 36 be d0 a4 c3 08 e4 f6 70 15 6e 1e 1f 6b 91 64 0b b8 d3 dd 0a e2 b3 58 1e>,
  asset: {
    amount: 2000000000n,
    recipientAddress: <Buffer 3e 56 5c 6f 2d 22 e0 a3 c1 e4 71 76 72 ec 8a c6 1c 26 60 f2>,
    data: 'Happy birthday!'
  },
  signatures: [
    <Buffer 3c 77 8c e7 b9 8e 72 e6 6b e1 83 86 b4 c1 97 b0 79 3d dc 33 ac ad 8d df 38 d3 52 9f 6a 76 ba 5e 5a ed 54 22 3f b8 36 81 61 b0 2c 71 68 88 3b 09 df b3 ... 14 more bytes>
  ],
  id: <Buffer 95 d2 d3 29 90 cd c7 f3 ae e5 54 b3 f5 23 7b fb f3 4c 33 48 e5 83 72 7a ce dd e5 b3 b6 e3 e7 25>
}
*/

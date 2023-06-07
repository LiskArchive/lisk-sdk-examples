const { validator } = require('@liskhq/lisk-client');
const { transactionSchema } = require('../schemas');
// Example account credentials
const account = require('./account.json');

const createTxOffline = () => {
	// Adjust the values of the unsigned transaction manually
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
	validator.validator.validate(transactionSchema, unsignedTransaction);

	// Create the asset for the Token Transfer transaction
	const transferParams = {
		tokenID: Buffer.from('0000000000000000','hex'),
		amount: BigInt(2000000000),
		recipientAddress: Buffer.from(account.binaryAddress,'hex'),
		data: 'Happy birthday!'
	};

	// Add the transaction params to the transaction object
	unsignedTransaction.params = transferParams;

	// Return the unsigned transaction object
	return unsignedTransaction;
}

module.exports = { createTxOffline }
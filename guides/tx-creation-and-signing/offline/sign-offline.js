const { transactions } = require('@liskhq/lisk-client');
const { transferParamsSchema } = require('../schemas');
const account = require('./account.json');

const chainID = '00000000';

const signTx = (unsignedTransaction) => {
	const signedTransaction = transactions.signTransaction(
		unsignedTransaction,
		Buffer.from(chainID, 'hex'),
		Buffer.from(account.privateKey,'hex'),
		transferParamsSchema
	);

	return signedTransaction;
}


module.exports = { signTx }
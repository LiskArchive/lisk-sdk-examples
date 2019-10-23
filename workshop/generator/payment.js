const transactions = require('@liskhq/lisk-transactions');
const { PaymentTransaction } = require('../transactions/index');
const { dateToLiskEpochTimestamp } = require('./utils');

const createRawPaymentTransaction = ({ recipientId, amount, invoiceId }, passphrase) => {
	const paymentTransaction = new PaymentTransaction({
		asset: {
			data: invoiceId,
		},
		amount: transactions.utils.convertLSKToBeddows(amount),
		recipientId,
		timestamp: dateToLiskEpochTimestamp(new Date()),
		fee: PaymentTransaction.FEE,
	});

	paymentTransaction.sign(passphrase);
	return paymentTransaction;
};

const recipientId = '16313739661670634666L'; // Address of user that send the invoice to me
const passphrase =
	'robust swift grocery peasant forget share enable convince deputy road keep cheap'; // Passphrase of person who wants to fulfill invoice (associated address: 8273455169423958419L)

const paymentTransaction = createRawPaymentTransaction(
	{
		recipientId,
		amount: '11', // Requested amount: 10.5 (want to give bit extra)
		invoiceId: '6068542855269194380', // Look up the ID of the invoice you have created (use: http://localhost:4000/api/transactions?type=13)
	},
	passphrase,
);

console.log('------------- Payment Tx - Type 14 -----------------');
console.log(
	`curl -XPOST -H "Content-type: application/json" -d '${paymentTransaction.stringify()}' http://localhost:4000/api/transactions`,
);
process.exit(0);

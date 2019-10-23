const transactions = require('@liskhq/lisk-transactions');

// ------- Transfer Transaction JSON to fund account ------- //
const transaction = transactions.utils.signRawTransaction({
	transaction: {
		type: 0,
		amount: '10000000000', // 100 LSK
		recipientId: '8273455169423958419L',
		fee: '10000000',
		asset: {},
	},
	passphrase:
		'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
});

console.log('------------- Fund Account Tx - Type 0 -----------------');
console.log(
	`curl -XPOST -H "Content-type: application/json" -d '${JSON.stringify(transaction)}' http://localhost:4000/api/transactions`,
);
process.exit(0);

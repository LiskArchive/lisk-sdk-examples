const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const InvoiceTransaction = require('./transactions/invoice_transaction');
const PaymentTransaction = require('./transactions/payment_transaction');

const app = new Application(genesisBlockDevnet, configDevnet);

app.registerTransaction(13, InvoiceTransaction);
app.registerTransaction(14, PaymentTransaction);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});

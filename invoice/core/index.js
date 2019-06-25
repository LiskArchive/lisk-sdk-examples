const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const { InvoiceTransaction, PaymentTransaction } = require('../transactions');

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

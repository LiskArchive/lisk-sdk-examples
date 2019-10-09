const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
// const { InvoiceTransaction } = require('./transactions/index');
// const { PaymentTransaction } = require('./transactions/index');

const app = new Application(genesisBlockDevnet, configDevnet);

// app.registerTransaction(InvoiceTransaction);
// app.registerTransaction(PaymentTransaction); 

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});

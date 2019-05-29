const { Application, genesisBlockDevnet, configDevnet} = require('lisk-sdk');
const HelloTransaction = require('./hello_transaction');

const app = new Application(genesisBlockDevnet, configDevnet);

app.registerTransaction(10, HelloTransaction);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});

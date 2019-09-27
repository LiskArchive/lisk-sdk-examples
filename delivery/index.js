const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const RegisterPackageTransaction = require('transactions/register-package');

configDevnet.app.label = 'lisk-delivery';

const app = new Application(genesisBlockDevnet, configDevnet);
app.registerTransaction(RegisterPackageTransaction);

app
    .run()
    .then(() => app.logger.info('App started...'))
    .catch(error => {
        console.error('Faced error in application', error);
        process.exit(1);
    });

const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const RegisterPacketTransaction = require('transactions/register-packet');

configDevnet.app.label = 'lisk-delivery';

const app = new Application(genesisBlockDevnet, configDevnet);
app.registerTransaction(RegisterPacketTransaction);

app
    .run()
    .then(() => app.logger.info('App started...'))
    .catch(error => {
        console.error('Faced error in application', error);
        process.exit(1);
    });

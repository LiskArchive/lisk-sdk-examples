const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const RegisterPacketTransaction = require('../transactions/register-packet');
const StartTransportTransaction = require('../transactions/start-transport');
const FinishTransportTransaction = require('../transactions/finish-transport');

configDevnet.app.label = 'lisk-transport';

const app = new Application(genesisBlockDevnet, configDevnet);
app.registerTransaction(RegisterPacketTransaction);
app.registerTransaction(StartTransportTransaction);
app.registerTransaction(FinishTransportTransaction);

app
    .run()
    .then(() => app.logger.info('App started...'))
    .catch(error => {
        console.error('Faced error in application', error);
        process.exit(1);
    });

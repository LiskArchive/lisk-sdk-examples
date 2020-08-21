const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const RegisterPacketTransaction = require('../transactions/solutions/register-packet');
const StartTransportTransaction = require('../transactions/solutions/start-transport');
const FinishTransportTransaction = require('../transactions/solutions/finish-transport');
const LightAlarmTransaction = require('../transactions/solutions/light-alarm');

configDevnet.label = 'lisk-transport';
configDevnet.modules.http_api.access.public = true;
//configDevnet.components.logger.consoleLogLevel = 'debug';

const app = new Application(genesisBlockDevnet, configDevnet);
app.registerTransaction(RegisterPacketTransaction);
app.registerTransaction(StartTransportTransaction);
app.registerTransaction(FinishTransportTransaction);
app.registerTransaction(LightAlarmTransaction);

app
    .run()
    .then(() => app.logger.info('App started...'))
    .catch(error => {
        console.error('Faced error in application', error);
        process.exit(0);
    });

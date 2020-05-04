const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
//const RegisterPacketTransaction = require('../transactions/register-packet');
//const StartTransportTransaction = require('../transactions/start-transport');
//const FinishTransportTransaction = require('../transactions/finish-transport');
const LightAlarmTransaction = require('../transactions/light-alarm');

configDevnet.app.label = 'lisk-transport';
configDevnet.modules.http_api.access.public = true;
// configDevnet.components.storage.host = 'db';

const app = new Application(genesisBlockDevnet, configDevnet);
//app.registerTransaction(RegisterPacketTransaction);
//app.registerTransaction(StartTransportTransaction);
//app.registerTransaction(FinishTransportTransaction);
app.registerTransaction(LightAlarmTransaction);

app
    .run()
    .then(() => app.logger.info('App started...'))
    .catch(error => {
        console.error('Faced error in application', error);
        process.exit(0);
    });

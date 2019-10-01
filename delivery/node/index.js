const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const RegisterPacketTransaction = require('../transactions/register-packet');
const RegisterCarrierTransaction = require('../transactions/register-carrier');
const UnregisterCarrierTransaction = require('../transactions/unregister-carrier');
const StartDeliveryTransaction = require('../transactions/start-delivery');
const FinishDeliveryTransaction = require('../transactions/finish-delivery');

configDevnet.app.label = 'lisk-delivery';

const app = new Application(genesisBlockDevnet, configDevnet);
app.registerTransaction(RegisterPacketTransaction);
app.registerTransaction(RegisterCarrierTransaction);
app.registerTransaction(UnregisterCarrierTransaction);
app.registerTransaction(StartDeliveryTransaction);
app.registerTransaction(FinishDeliveryTransaction);

app
    .run()
    .then(() => app.logger.info('App started...'))
    .catch(error => {
        console.error('Faced error in application', error);
        process.exit(1);
    });

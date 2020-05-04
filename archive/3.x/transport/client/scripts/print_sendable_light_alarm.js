const LightAlarmTransaction = require('../transactions/light-alarm');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');
const accounts = require('./accounts.json');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

let tx =  new LightAlarmTransaction({
    asset: { message: "packet open!"},
    fee: '0',
    recipientId: accounts.recipient.address,
    timestamp: getTimestamp()
});

/* Note: Always update to the package you are using in accounts.json*/
tx.sign(accounts.packet.passphrase); // Signed and send by package

console.log(tx.stringify());
process.exit(0);

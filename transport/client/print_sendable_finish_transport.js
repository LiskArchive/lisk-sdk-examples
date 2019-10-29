const FinishTransportTransaction = require('../transactions/finish-transport');
//const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');
const accounts = require('./accounts.json');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

let tx =  new FinishTransportTransaction({
    asset: {
        status: "success"
    },
    fee: '0',
    recipientId: accounts.packet.address,
    timestamp: getTimestamp()
});

tx.sign(accounts.recipient.passphrase); // 10881167371402274308L

console.log(tx.stringify());
process.exit(0);

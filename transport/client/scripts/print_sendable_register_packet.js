const RegisterPacketTransaction = require('../transactions/register-packet');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');
const accounts = require('./accounts.json');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

let tx =  new RegisterPacketTransaction({
    asset: {
        packetId: accounts.packet.address,
        postage: `${transactions.utils.convertLSKToBeddows('5')}`,
        security: `${transactions.utils.convertLSKToBeddows('100')}`,
        minTrust: 0,
    },
    fee: '0',
    recipientId: accounts.recipient.address,
    timestamp: getTimestamp()
});

tx.sign(accounts.sender.passphrase); // 16313739661670634666L

console.log(tx.stringify());
process.exit(0);

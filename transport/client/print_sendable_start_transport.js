const StartTranportTransaction = require('../transactions/start-transport');
//const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

const packetCredentials = { address: '8589518043398634788L',
    passphrase:
        'deal video upper toddler butter pupil helmet outer lecture goat shell guilt',
    publicKey:
        '74f094b8c5eb5ccf7765fb5b111c94e132e04d32d880beca6ff5599ef8f45400',
    privateKey:
        'e7357004da88509c75b37ed9cb01a8716200f7d1964df3c124ba87a0a23277c274f094b8c5eb5ccf7765fb5b111c94e132e04d32d880beca6ff5599ef8f45400' }


let tx =  new StartTranportTransaction({
    asset: {
        packetId: packetCredentials.address
    },
    fee: '0',
    recipientId: '10881167371402274308L', // dummy delegate_100
    timestamp: getTimestamp()
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble'); // 16313739661670634666L

console.log(tx.stringify());
process.exit(0);

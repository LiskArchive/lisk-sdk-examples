const RegisterPacketTransaction = require('../transactions/register-packet');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

const packetCredentials = { address: '3715338682269676579L',
passphrase:
 'shaft angle ivory inhale hawk quantum below enter load drum boss silent',
publicKey:
 '6a5ad57be35517c0dfa18c45475f7a76592f8b4c99bc4224f2829e4297b901f9',
privateKey:
 '8b4c4d91a5aa9b7476330b323244c75c8c32c7fdd7181ecf8d3bd113f662fcf16a5ad57be35517c0dfa18c45475f7a76592f8b4c99bc4224f2829e4297b901f9' }

let tx =  new RegisterPacketTransaction({
    asset: {
        packetId: packetCredentials.address,
        porto: `${transactions.utils.convertLSKToBeddows('5')}`,
        security: `${transactions.utils.convertLSKToBeddows('100')}`,
        minTrust: 5,
    },
    fee: '0',
    recipientId: '10881167371402274308L', // dummy delegate_100
    timestamp: getTimestamp()
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble'); // 16313739661670634666L

console.log(tx.stringify());
process.exit(0);

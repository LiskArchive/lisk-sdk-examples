const RegisterPacketTransaction = require('../transactions/register-packet');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

const packetCredentials = { address: '933972897873682359L',
    passphrase:
        'warfare science dirt response size torch paper horn suspect inmate prize way',
    publicKey:
        '26fa78c7747de51aba9ca2f9ca9d8566bfb3638a77d03a44990ddecee7ef62ee',
    privateKey:
        '39bcd0ed4e3f417af9a1276721dae20658c6e0051792671935d20465d675b4b126fa78c7747de51aba9ca2f9ca9d8566bfb3638a77d03a44990ddecee7ef62ee'
};

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

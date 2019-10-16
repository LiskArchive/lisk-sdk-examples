const RegisterPacketTransaction = require('../transactions/register-packet');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

const packetCredentials = { address: '7955510739435963639L',
passphrase:
 'okay skill left caught nation tonight agree cover flush mean horn member',
publicKey:
 '69b1fdd660dc630709284364b2c6fd258ca5efe6130ddf63e96f4873b8a51b9b',
privateKey:
 '6688ef49838f973c065667ef2873b0e9b8de4782b8fcbf2336acb235928af88f69b1fdd660dc630709284364b2c6fd258ca5efe6130ddf63e96f4873b8a51b9b' }

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

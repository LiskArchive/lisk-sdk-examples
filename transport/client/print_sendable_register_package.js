const RegisterPacketTransaction = require('../transactions/register-packet');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

const packetCredentials = { address: '13072505682812576010L',
    passphrase:
        'six subway group pioneer feature flame guess gather frog head start improve',
    publicKey:
        '561c89a44d2820ae08e9bc178fa5e1ca2bcf5ba79f1f176fa1bd195b288dbb4f',
    privateKey:
        '157f4882811c0a429fcfdc3e890a9eabedc162682e1829b546e6e64e3466f1e5561c89a44d2820ae08e9bc178fa5e1ca2bcf5ba79f1f176fa1bd195b288dbb4f' }


let tx =  new RegisterPacketTransaction({
    asset: {
        packetId: packetCredentials.address,
        porto: `${transactions.utils.convertLSKToBeddows('5')}`,
        security: `${transactions.utils.convertLSKToBeddows('100')}`,
        minTrust: 0,
    },
    fee: '0',
    recipientId: '10881167371402274308L', // dummy delegate_100
    timestamp: getTimestamp()
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble'); // 16313739661670634666L

console.log(tx.stringify());
process.exit(0);

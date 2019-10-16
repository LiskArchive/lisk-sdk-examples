const LightAlarmTransaction = require('../transactions/light-alarm');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
};

/* Note: Always update to the package you are using */
const packetCredentials = { address: '5090763841295658446L',
passphrase:
 'that cost affair hungry brain coil tiger similar van notable hen soup',
publicKey:
 'a206204c9eedabb190a1759be2b816eb0934a18ebee70d9c014d2a55842f88f3',
privateKey:
 '5a2e6d7fc3996f800a7385e23e6243210193eeb73c83d4636d1aad157386a477a206204c9eedabb190a1759be2b816eb0934a18ebee70d9c014d2a55842f88f3' }

let tx =  new LightAlarmTransaction({
    asset: {},
    fee: '0',
    recipientId: '10881167371402274308L', // dummy delegate_100 (receiver for package)
    timestamp: getTimestamp()
});

tx.sign(packetCredentials.passphrase); // Signed and send by package

console.log(tx.stringify());
process.exit(0);

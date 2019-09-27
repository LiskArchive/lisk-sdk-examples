const RegisterPackageTransaction = require('../transactions/register-package');
const transactions = require('@liskhq/lisk-transactions');
const cryptography = require('@liskhq/lisk-cryptography');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');
const { Mnemonic } = require('@liskhq/lisk-passphrase');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return  parseInt(inSeconds);
};

const getPackageCredentials = () => {
    const passphrase = Mnemonic.generateMnemonic();
    const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(
        passphrase
    );
    const credentials = {
        address: cryptography.getAddressFromPublicKey(keys.publicKey),
        passphrase: passphrase,
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
    }
    return credentials;
};

const packageCredentials = getPackageCredentials();

let tx =  new RegisterPackageTransaction({
    asset: {
        packageId: packageCredentials.address,
        senderLocation: "def alley, 456 someCity",
        receiverId: "123L",
        receiverLocation: "abc street, 123 someCity",
        porto: `${transactions.utils.convertLSKToBeddows('5')}`,
        minSecurity: `${transactions.utils.convertLSKToBeddows('100')}`,
        minTrust: 25,
        estTravelTime: "18000", // 18,000 seconds = 5 hrs
        deliveryStatus: "pending"
    },
    //fee: `${transactions.utils.convertLSKToBeddows('1')}`,
    fee: "0",
    recipientId: "10881167371402274308L",
    timestamp: getTimestamp()
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble');

console.log("+++++++++++++++++++++++++++++++++" );
console.log("Package Credentials:" + packageCredentials);
console.log("+++++++++++++++++++++++++++++++++" );
console.log("+++++++++++++++++++++++++++++++++" );
console.log(tx.stringify());
console.log("+++++++++++++++++++++++++++++++++" );
process.exit(0);

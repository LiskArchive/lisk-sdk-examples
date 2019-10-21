const transactions = require('@liskhq/lisk-transactions');
const cryptography = require('@liskhq/lisk-cryptography');
const { APIClient } = require('@liskhq/lisk-api-client');
const { Mnemonic } = require('@liskhq/lisk-passphrase');

const api = new APIClient(['http://localhost:4000']);

/**
 * Util function for creating credentials object.
 *
 * @param {Object} credentials
 * @param {string} credentials.address
 * @param {string} credentials.passphrase
 * @param {string} credentials.publicKey
 * @param {string} credentials.privateKey
 */
const getPacketCredentials = () => {
    const passphrase = Mnemonic.generateMnemonic();
    const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(
        passphrase
    );
    const credentials = {
        address: cryptography.getAddressFromPublicKey(keys.publicKey),
        passphrase: passphrase,
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
    };
    return credentials;
};

const packetCredentials = getPacketCredentials();

let tx = new transactions.TransferTransaction({
    amount: '1',
    recipientId: packetCredentials.address,
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble'); // Genesis account with address: 16313739661670634666L

api.transactions.broadcast(tx.toJSON()).then(res => {
    console.log("++++++++++++++++ API Response +++++++++++++++++");
    console.log(res.data);
    console.log("++++++++++++++++ Credentials +++++++++++++++++");
    console.dir(packetCredentials);
    console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
    console.log(tx.stringify());
    console.log("++++++++++++++++ End Script +++++++++++++++++");
}).catch(err => {
    console.log(JSON.stringify(err.errors, null, 2));
});

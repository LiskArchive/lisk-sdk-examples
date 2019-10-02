const transactions = require('@liskhq/lisk-transactions');
const cryptography = require('@liskhq/lisk-cryptography');
const { APIClient } = require('@liskhq/lisk-api-client');
const { Mnemonic } = require('@liskhq/lisk-passphrase');

const api = new APIClient(['http://localhost:4000']);

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

let tx =  new transactions.TransferTransaction({
    amount: '1235',
    recipientId: packetCredentials.address,
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble');

api.transactions.broadcast(tx.stringify()).then(res => {
    console.log(res.data);
    console.log("+++++++++++++++++++++++++++++++++" );
    console.dir(packetCredentials);
    console.log("+++++++++++++++++++++++++++++++++" );
    console.log("+++++++++++++++++++++++++++++++++" );
    console.log(tx.stringify());
    console.log("+++++++++++++++++++++++++++++++++" );
});



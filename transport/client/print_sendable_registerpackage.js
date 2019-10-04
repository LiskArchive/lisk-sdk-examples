const RegisterPacketTransaction = require('../transactions/register-packet');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return  parseInt(inSeconds);
};

const packetCredentials = { address: '5420762878027534930L',
    passphrase:
        'range axis twin quote rate rifle cute math quantum talk must round',
    publicKey:
        '1529b602ea69497ff5e38c3d1db5e90f9dfb6ee2f0e83534c89f18579a24653b',
    privateKey:
        'f3058da026f8b1a93643dc6864fc5ef7830b7614dd09292bc5f2ca3d4b115f9e1529b602ea69497ff5e38c3d1db5e90f9dfb6ee2f0e83534c89f18579a24653b'
}; // insert here the packetCredentials-object created in create_and_initialize_packet_account.js

let tx =  new RegisterPacketTransaction({
    asset: {
        packetId: packetCredentials.address,
        senderLocation: "def alley, 456 someCity",
        receipientLocation: "abc street, 123 someCity",
        porto: `${transactions.utils.convertLSKToBeddows('5')}`,
        security: `${transactions.utils.convertLSKToBeddows('100')}`,
        minTrust: 25,
        estTravelTime: "18000", // 18,000 seconds = 5 hrs
    },
    fee: "0",
    recipientId: "10881167371402274308L",
    timestamp: getTimestamp()
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble');

console.log(tx.stringify());
process.exit(0);

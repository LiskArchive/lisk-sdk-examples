const transactions = require('@liskhq/lisk-transactions');
const cryptography = require('@liskhq/lisk-cryptography');
const { APIClient } = require('@liskhq/lisk-api-client');
const { Mnemonic } = require('@liskhq/lisk-passphrase');
const accounts = require('./accounts.json');

const api = new APIClient(['http://localhost:4000']);

let tx = new transactions.TransferTransaction({
    amount: `${transactions.utils.convertLSKToBeddows('2000')}`,
    recipientId: accounts.carrier.address,
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble'); // Genesis account with address: 16313739661670634666L

api.transactions.broadcast(tx.toJSON()).then(res => {
    console.log("++++++++++++++++ API Response +++++++++++++++++");
    console.log(res.data);
    console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
    console.log(tx.stringify());
    console.log("++++++++++++++++ End Script +++++++++++++++++");
}).catch(err => {
    console.log(JSON.stringify(err.errors, null, 2));
});

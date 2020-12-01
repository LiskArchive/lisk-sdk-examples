const HelloTransaction = require('../transactions/hello_transaction');
const { cryptography } = require('@liskhq/lisk-client');

const networkIdentifier = cryptography.getNetworkIdentifier(
    "19074b69c97e6f6b86969bb62d4f15b888898b499777bda56a3a2ee642a7f20a",
    "Lisk",
);

const tx = new HelloTransaction({
    asset: {
        hello: 'world',
    },
    nonce: "103",
    fee: "1000000"
});

tx.sign(networkIdentifier,'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready');

console.log(tx.stringify());
process.exit(0);

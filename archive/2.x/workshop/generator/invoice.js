const transactions = require('@liskhq/lisk-transactions');
const { InvoiceTransaction } = require('../transactions/index');
const { dateToLiskEpochTimestamp } = require('./utils');

const createRawInvoiceTransaction = ({
    client, requestedAmount, description,
}, recipientAddress, passphrase) => {
    const invoiceTransaction = new InvoiceTransaction({
        asset: {
            client,
            requestedAmount: transactions.utils.convertLSKToBeddows(requestedAmount),
            description,
        },
        recipientId: recipientAddress,
        timestamp: dateToLiskEpochTimestamp(new Date()),
        fee: InvoiceTransaction.FEE,
    });

    invoiceTransaction.sign(passphrase);
    return invoiceTransaction;
};

const recipientId = '8273455169423958419L'; // Associated passphrase: robust swift grocery peasant forget share enable convince deputy road keep cheap
const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble'; // Associated account ID: 16313739661670634666L

const invoiceTransaction = createRawInvoiceTransaction({
    client: 'Michiel GmbH',
    requestedAmount: '10.5',
    description: 'Workshop delivered',
}, recipientId, passphrase);

console.log('------------- Invoice Tx - Type 13 -----------------');
console.log(
	`curl -XPOST -H "Content-type: application/json" -d '${invoiceTransaction.stringify()}' http://localhost:4000/api/transactions`,
);
process.exit(0);
const transactions = require('@liskhq/lisk-transactions');
const { InvoiceTransaction } = require('../transactions/index');
const { dateToLiskEpochTimestamp } = require('./utils');

const createInvoiceJSON = ({
    client, requestedAmount, description,
}, recipientAddress, passphrase) => {
    const invoiceTx = new InvoiceTransaction({
        asset: {
            client,
            requestedAmount: transactions.utils.convertLSKToBeddows(requestedAmount),
            description,
        },
        recipientId: recipientAddress,
        timestamp: dateToLiskEpochTimestamp(new Date()),
        fee: InvoiceTransaction.FEE,
    });

    invoiceTx.sign(passphrase);
    return invoiceTx.toJSON();
};

const recipientId = '8273455169423958419L'; // Associated passphrase: robust swift grocery peasant forget share enable convince deputy road keep cheap
const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble'; // Associated account ID: 16313739661670634666L

const invoiceJSON = createInvoiceJSON({
    client: 'Michiel GmbH',
    requestedAmount: '10.5',
    description: 'Workshop delivered',
}, recipientId, passphrase);

console.log(invoiceJSON);

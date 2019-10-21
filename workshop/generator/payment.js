const transactions = require('@liskhq/lisk-transactions');
const { PaymentTransaction } = require('../transactions/index');
const { dateToLiskEpochTimestamp } = require('./utils');

const createPaymentJSON = ({
    recipientId, amount, invoiceId,
}, passphrase) => {
    const paymentTx = new PaymentTransaction({
        asset: {
            data: invoiceId,
        },
        amount: transactions.utils.convertLSKToBeddows(amount),
        recipientId,
        timestamp: dateToLiskEpochTimestamp(new Date()),
        fee: PaymentTransaction.FEE,
    });

    paymentTx.sign(passphrase);
    return paymentTx;
};

const recipientId = '16313739661670634666L'; // Address of user that send the invoice to me
const passphrase = 'robust swift grocery peasant forget share enable convince deputy road keep cheap'; // Passphrase of person who wants to fulfill invoice (associated address: 8273455169423958419L)

const paymentTransaction = createPaymentJSON({
    recipientId,
    amount: '11', // Requested amount: 10.5 (want to give bit extra)
    invoiceId: '6068542855269194380', // Look up the ID of the invoice you have created (use: http://localhost:4000/api/transactions?type=13)
}, passphrase);

console.log('------------- Payment Tx - Type 14 -----------------');
console.log(paymentTransaction.stringify());
console.log('------------- Fund Account Tx - Type 0 -----------------');

// ------- Payment JSON to fund account ------- //
const transaction = transactions.utils.signRawTransaction({
    transaction: {
        type: 0,
        amount: '10000000000', // 100 LSK
        recipientId: '8273455169423958419L',
        fee: '10000000',
        asset: {},
    },
    passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
});

console.log(JSON.stringify(transaction));
process.exit(0);

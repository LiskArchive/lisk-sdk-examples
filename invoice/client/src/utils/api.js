import { APIClient } from '@liskhq/lisk-client';
import {
  InvoiceTransaction,
  PaymentTransaction,
} from 'lisk-bills-transactions';
import { getAddressAndPublicKeyFromPassphrase } from '@liskhq/lisk-cryptography';
import { to } from 'await-to-js';
import * as transactions from '@liskhq/lisk-transactions';

import { dateToLiskEpochTimestamp } from './formatters';
import config from '../config.json';

const getApiClient = () => (
  new APIClient([config.serverUrl], { nethash: config.nethash })
);

export const getInvoices = ({ address }) => new Promise(async (resolve, reject) => {
  const [invoicesError, invoicesResponse] = await to(getApiClient().transactions.get({
    senderIdOrRecipientId: address,
    sort: 'timestamp:desc',
    limit: 100,
    type: InvoiceTransaction.TYPE,
  }));
  if (invoicesError) reject(invoicesError);

  const [paymentsError, paymentsResponse] = await to(getApiClient().transactions.get({
    sort: 'timestamp:desc',
    limit: 100,
    type: PaymentTransaction.TYPE,
  }));
  if (paymentsError) reject(paymentsError);

  const invoices = {
    ...invoicesResponse,
    data: invoicesResponse.data.map(invoiceTx => ({
      ...invoiceTx,
      paidStatus: paymentsResponse.data.find(paymentTx => paymentTx.asset.data === invoiceTx.id),
    })),
  };

  resolve(invoices);
});

export const getAccount = ({ passphrase }) => new Promise(async (resolve, reject) => {
  const { publicKey, address } = getAddressAndPublicKeyFromPassphrase(passphrase);
  const [error, response] = await to(getApiClient().accounts.get({ address }));
  if (!error) {
    if (response.data.length > 0) {
      resolve({
        ...response.data[0],
        publicKey,
        passphrase,
      });
    } else {
    // when the account has no transactions yet (therefore is not saved on the blockchain)
    // this endpoint returns { success: false }
      resolve({
        passphrase,
        address,
        publicKey,
        balance: '0',
      });
    }
  } else {
    reject(error);
  }
});

const createInvoice = ({
  client, requestedAmount, description,
}, passphrase) => (
  new InvoiceTransaction({
    asset: {
      client,
      requestedAmount: transactions.utils.convertLSKToBeddows(requestedAmount),
      description,
    },
    recipientId: client,
    timestamp: dateToLiskEpochTimestamp(new Date()),
  })
);

export const sendInvoice = ({
  client, requestedAmount, description,
}, passphrase) => {
  const invoiceTx = createInvoice({
    client, requestedAmount, description,
  }, passphrase);

  invoiceTx.sign(passphrase);
  return getApiClient().transactions.broadcast(invoiceTx.toJSON());
};

const createPayment = ({
  recipientId, amount, invoiceID,
}, passphrase) => (
  new PaymentTransaction({
    asset: {
      data: invoiceID,
    },
    amount: transactions.utils.convertLSKToBeddows(amount),
    recipientId,
    timestamp: dateToLiskEpochTimestamp(new Date()),
  })
);

export const sendPayment = ({
  recipientId, amount, invoiceID,
}, passphrase) => {
  const paymentTx = createPayment({
    recipientId, amount, invoiceID,
  }, passphrase);

  paymentTx.sign(passphrase);
  return getApiClient().transactions.broadcast(paymentTx.toJSON());
};

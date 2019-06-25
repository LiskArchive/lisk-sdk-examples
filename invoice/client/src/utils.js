import { APIClient } from '@liskhq/lisk-client';
import { InvoiceTransaction } from 'lisk-bills-transactions';
import { getAddressAndPublicKeyFromPassphrase } from '@liskhq/lisk-cryptography';
import * as constants from '@liskhq/lisk-constants';
import formatCurrency from 'format-currency';
import moment from 'moment';
import * as transactions from '@liskhq/lisk-transactions';

import config from './config.json';

export const dateToLiskEpochTimestamp = date => (
  (new Date(date).getTime() / 1000) - constants.EPOCH_TIME_SECONDS
);

export const liskEpochTimestampToDate = timestamp => (
  new Date((timestamp + constants.EPOCH_TIME_SECONDS) * 1000)
);

export const formatTimestamp = timestamp => (
  moment(liskEpochTimestampToDate(timestamp)).fromNow()
);

export const formatAmount = amount => (
  formatCurrency(
    transactions.utils.convertBeddowsToLSK(amount),
    { format: '%v %c', code: config.token, maxFraction: 8 },
  )
);

const getApiClient = () => (
  new APIClient([config.serverUrl], { nethash: config.nethash })
);

export const getTransactions = ({ address }) => (
  getApiClient().transactions.get({
    senderIdOrRecipientId: address,
    sort: 'timestamp:desc',
    type: InvoiceTransaction.TYPE,
  })
);

export const getAccount = ({ passphrase }) => new Promise((resolve, reject) => {
  const { publicKey, address } = getAddressAndPublicKeyFromPassphrase(passphrase);
  getApiClient().accounts.get({ address }).then((response) => {
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
        balance: 0,
      });
    }
  }).catch(reject);
});

export const sendInvoice = ({
  client, requestedAmount, description,
}, passphrase) => {
  let invoiceTx = new InvoiceTransaction({
    type: InvoiceTransaction.TYPE,
    asset: {
      client,
      requestedAmount: transactions.utils.convertLSKToBeddows(requestedAmount),
      description,
    },
    fee: transactions.utils.convertLSKToBeddows('10'),
    senderPublicKey: getAddressAndPublicKeyFromPassphrase(passphrase).publicKey,
    recipientId: client,
    timestamp: dateToLiskEpochTimestamp(new Date()),
  });

  invoiceTx = invoiceTx.sign(passphrase);
  return getApiClient().transactions.broadcast(invoiceTx);
};

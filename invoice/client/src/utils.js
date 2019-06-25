import * as transactions from '@liskhq/lisk-transactions';
import { getAddressAndPublicKeyFromPassphrase } from '@liskhq/lisk-cryptography';
import { InvoiceTransaction } from 'lisk-bills-transactions';
import { APIClient } from '@liskhq/lisk-client';
import config from './config.json';


const getApiClient = () => (
  new APIClient([config.serverUrl], { nethash: config.nethash })
);

export const getTransactions = ({ address }) => (
  getApiClient().transactions.get({ senderIdOrRecipientId: address, sort: 'timestamp:desc' })
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
    timestamp: 0,
  });

  invoiceTx = invoiceTx.sign(passphrase);
  return getApiClient().transactions.broadcast(invoiceTx);
};

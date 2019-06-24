import { getAddressAndPublicKeyFromPassphrase } from '@liskhq/lisk-cryptography';
import { APIClient } from '@liskhq/lisk-client';

import config from './config.json';


const getApiClient = () => (
  new APIClient([config.serverUrl], { nethash: config.nethash })
);

export const getTransactions = ({ address }) => (
  getApiClient().transactions.get({ senderIdOrRecipientId: address })
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

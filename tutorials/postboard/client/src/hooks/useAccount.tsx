import { useState } from 'react';
import { transactions } from '@liskhq/lisk-client';
import { AccountApiResponse, AccountType } from 'types/Account.type';
import { extractHexAddress, getAddressFromHex } from 'utils/account';
import { getClient } from 'utils/getClient';
import useAlert from './useAlert';

const useAccount = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const alert = useAlert();

  const getAccount = (address: string): Promise<AccountType> => {
    const hexAddress = extractHexAddress(address);
    setLoading(true);
    return new Promise((resolve) => {
      getClient().then((client) => {
        client
          .invoke('app:getAccount', {
            address: hexAddress,
          })
          .then((res) => {
            setLoading(false);
            const accObject = client.account.decode(res);
            const accJSON: AccountApiResponse = client.account.toJSON(accObject);
            resolve({
              username: accJSON.dpos.delegate.username,
              address: accJSON.address,
              followers: accJSON.post.followers.map((acc) => getAddressFromHex(Buffer.from(acc, 'hex'))),
              following: accJSON.post.following.map((acc) => getAddressFromHex(Buffer.from(acc, 'hex'))),
              posts: accJSON.post.posts,
              replies: accJSON.post.replies,
            });
          });
      });
    });
  };

  const followAccount = (account: string, passphrase: string) => {
    getClient()
      .then(async (client) => {
        const tx = await client.transaction.create(
          {
            moduleID: 1000,
            assetID: 4,
            fee: BigInt(transactions.convertLSKToBeddows('0.1')),
            asset: {
              account,
            },
          },
          passphrase,
        );
        console.log('Transaction object: ', tx);
        await client.transaction.send(tx);
        alert.showSuccessAlert('Followed');
      })
      .catch((err) => {
        alert.showErrorAlert(err.message);
      });
  };

  const isFollowing = (address: string, following: Array<string>): boolean => {
    return following.indexOf(address) !== -1;
  };

  return { isLoading, followAccount, getAccount, isFollowing };
};

export default useAccount;

import { useState } from 'react';
import { transactions } from '@liskhq/lisk-client/browser';
import { AccountType } from 'types/Account.type';
import { getClient } from 'utils/getClient';
import useAlert from './useAlert';
import { extractPrivateKey } from 'app/utils/account';

const useAccount = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const alert = useAlert();

  const getAccount = (address: string): Promise<AccountType> => {
    setLoading(true);
    return new Promise((resolve) => {
      getClient().then((client) => {
        client
          .invoke('post_getAccount', {
            address: address,
          })
          .then((res) => {
            setLoading(false);
            resolve({
              username: res.address,
              address: res.address,
              followers: res.post.followers,
              following: res.post.following,
              /*
              followers: res.followers.map((acc) => getAddressFromHex(Buffer.from(acc, 'hex'))),
              following: res.following.map((acc) => getAddressFromHex(Buffer.from(acc, 'hex'))),*/
              posts: res.post.posts,
              replies: res.post.replies,
            });
          });
      });
    });
  };

  const followAccount = (account: string, passphrase: string) => {
    getClient()
      .then(async (client) => {
        const sk = await extractPrivateKey(passphrase);
        const tx = await client.transaction.create(
          {
            module: 'post',
            command: 'follow',
            fee: BigInt(transactions.convertLSKToBeddows('0.1')),
            params: {
              account,
            },
          },
          sk,
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

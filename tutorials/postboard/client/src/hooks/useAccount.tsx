import { transactions } from '@liskhq/lisk-client';
import { useState } from 'react';
import { AccountApiResponse, AccountType } from 'types/Account.type';
import { extractHexAddress } from 'utils/account';
import { getClient } from 'utils/getClient';

const useAccount = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

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
              followers: accJSON.post.followers,
              following: accJSON.post.following,
              posts: accJSON.post.posts,
              replies: accJSON.post.replies,
            });
          });
      });
    });
  };

  const followAccount = (account: string, passphrase: string) => {
    getClient().then(async (client) => {
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
      const res = await client.transaction.send(tx);
      console.log(res);
    });
  };

  return { isLoading, followAccount, getAccount };
};

export default useAccount;

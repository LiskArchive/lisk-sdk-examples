import { useEffect, useState } from 'react';
import { getClient } from 'utils/getClient';

const useAccount = (address: string) => {
  const [account, setAccount] = useState();

  const getAccount = () => {
    getClient().then((client) => {
      client
        .invoke('app:getAccount', {
          address,
        })
        .then((res) => {
          const accObject = client.account.decode(res);
          const accJSON = client.account.toJSON(accObject);
          console.log(accJSON);
          setAccount(accJSON);
        });
    });
  };

  useEffect(() => {
    if (address) {
      console.log('address', address);
      getAccount();
    }
  }, [address]);

  return { account };
};

export default useAccount;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAccount from 'hooks/useAccount';
import { AvatarSvg } from 'assets/icons';
import { stringShortener } from 'utils/helpers';
import { AccountType } from 'types/Account.type';
import { getAddressFromHex } from 'utils/account';

const ViewFollowers = () => {
  const address = useParams().id;
  const navigate = useNavigate();
  const { isLoading, getAccount } = useAccount();
  const [account, setAccount] = useState<AccountType | undefined>();

  useEffect(() => {
    if (address) {
      getAccount(address).then(setAccount);
    }
  }, [address]);

  const viewProfile = (address: string) => {
    navigate(`/profile/${getAddressFromHex(Buffer.from(address, 'hex'))}`);
  };

  if (isLoading && !account) {
    return <div className="spinner">Loading...</div>;
  }

  return !account?.followers.length ? (
    <h3>No followers yet</h3>
  ) : (
    <div>
      <h3 className="bold">Account</h3>
      {account.followers.map((follower) => (
        <div key={follower} className="card" onClick={() => viewProfile(follower)}>
          <div className="card-body">
            <AvatarSvg /> {stringShortener(follower, 5, 7)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewFollowers;

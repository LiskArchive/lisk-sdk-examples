import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAccountInfo } from "../api";
import Account from "./Account";

function AccountPage() {
  const { address } = useParams();
  const [account, setAccount] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setAccount(await fetchAccountInfo(address));
      setLoaded(true);
    }

    fetchData();
  }, [address]);

  return loaded ? <Account account={account} /> : <Fragment></Fragment>;
}

export default AccountPage;

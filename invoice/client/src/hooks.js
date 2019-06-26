import { useState, useEffect } from 'react';

import { getAccount } from './utils/api';
import { useStateValue } from './state';
import config from './config.json';

export function useApi(apiUtil, params) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchUrl() {
    const response = await apiUtil(params);
    setData(response.data);
    setLoading(false);
  }
  useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading];
}

export function usePassphraseToSignIn(history) {
  const [{ account }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signIn(passphrase) {
    setLoading(true);
    getAccount({ passphrase }).then((response) => {
      dispatch({
        type: 'accountSignedIn',
        account: response,
      });
      setLoading(false);
      history.push('/invoices');
    }).catch((response) => {
      setLoading(false);
      setError(`Error when fetching account information from ${config.serverUrl}: ${response}`);
    });
  }
  useEffect(() => {
    if (localStorage.getItem('passphrase') && account !== null) {
      signIn(localStorage.getItem('passphrase'));
    }
  }, []);
  return [loading, error, signIn];
}

import { useState, useEffect } from 'react';
import to from 'await-to-js';

import { formatServerError } from './utils/formatters';
import { getAccount } from './utils/api';
import { useStateValue } from './state';
import config from './config.json';

export function useApi(apiUtil, params) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  async function fetchUrl() {
    const [err, response] = await to(apiUtil(params));
    setLoading(false);
    if (err) {
      setError(formatServerError(err));
    } else {
      setData(response.data);
    }
  }
  useEffect(() => {
    fetchUrl();
  // This is meant to happen only on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [data, loading, error];
}

export function usePassphraseToSignIn(history) {
  const [{ account }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signIn(passphrase) {
    setLoading(true);
    const [response, err] = await to(getAccount({ passphrase }));
    if (!error) {
      dispatch({
        type: 'accountSignedIn',
        account: response,
      });
      setLoading(false);
      history.push('/invoices');
    } else {
      setLoading(false);
      setError(`Error when fetching account information from ${config.serverUrl}: ${err}`);
    }
  }
  useEffect(() => {
    if (localStorage.getItem('passphrase') && account !== null) {
      signIn(localStorage.getItem('passphrase'));
    }
  // This is meant to happen only on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [loading, error, signIn];
}

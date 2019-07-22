import { useState, useEffect } from 'react';
import to from 'await-to-js';

import { formatServerError } from './utils/formatters';
import { getAccount, getInvoices } from './utils/api';
import { useStateValue } from './state';
import config from './config.json';

const BLOCK_TIME = 10 * 1000;

export function useInvoices(params) {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  let timeout;
  async function fetchUrl() {
    const [err, response] = await to(getInvoices(params));
    setLoading(false);
    if (err) {
      setError(formatServerError(err));
    } else {
      setData(response.data);
    }
    timeout = setTimeout(fetchUrl, BLOCK_TIME);
  }
  useEffect(() => {
    fetchUrl();
    return function cleanup() {
      clearTimeout(timeout);
    };
  // This is meant to happen only on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [data, loading, error];
}

export function usePassphraseToSignIn(history) {
  const [{ account }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  let timeout;

  async function signIn(passphrase) {
    setLoading(true);
    const [err, response] = await to(getAccount({ passphrase }));
    setLoading(false);
    if (!err) {
      dispatch({
        type: 'accountUpdated',
        account: response,
      });
      if (history.location.pathname === '/') {
        history.push('/invoices');
      }
    } else {
      setError(`Error when fetching account information from ${config.serverUrl}: ${err}`);
    }
    timeout = setTimeout(signIn.bind(null, passphrase), BLOCK_TIME);
  }
  useEffect(() => {
    if (localStorage.getItem('passphrase') && account !== null) {
      signIn(localStorage.getItem('passphrase'));
    }
    return function cleanup() {
      clearTimeout(timeout);
    };
  // This is meant to happen only on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [loading, error, signIn];
}

import { useState, useEffect } from 'react';
import { useStateValue } from './state';
import { getAccount } from './utils';

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
  async function signIn(passphrase) {
    setLoading(true);
    getAccount({ passphrase }).then((response) => {
      dispatch({
        type: 'accountSignedIn',
        account: response,
      });
      setLoading(false);
      history.push('/invoices');
    });
  }
  useEffect(() => {
    if (localStorage.getItem('passphrase') && account !== null) {
      signIn(localStorage.getItem('passphrase'));
    }
  }, []);
  return [loading, signIn];
}

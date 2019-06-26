import { useState, useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
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

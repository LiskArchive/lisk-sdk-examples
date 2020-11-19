export const fetchNodeInfo = async () => {
  return fetch("http://localhost:4000/api/node/info")
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchAccountInfo = async (address) => {
  return fetch(`http://localhost:4000/api/accounts/${address}`)
    .then((res) => res.json())
    .then((res) => res.data);
};

export const sendTransactions = async (tx) => {
  return fetch("http://localhost:4000/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tx),
  })
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchAllNFTTokens = async () => {
  return fetch("http://localhost:8080/api/nft_tokens")
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchNFTToken = async (id) => {
  return fetch(`http://localhost:8080/api/nft_tokens/${id}`)
    .then((res) => res.json())
    .then((res) => res.data);
};

export const getAllTransactions = async () => {
  return fetch(`http://localhost:8080/api/transactions`)
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    });
};


const LISK_API = 'http://localhost:4000';
const CUSTOM_API = 'http://localhost:8080';

export const sendTransactions = async (tx) => {
    return fetch(LISK_API+"/api/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tx),
    });
};

export const fetchAccountInfo = async (address) => {
    return fetch(LISK_API+`/api/accounts/${address}`)
        .then((res) => res.json())
        .then((res) => res.data);
};

export const fetchHelloCounter = async () => {
    return fetch(CUSTOM_API+"/api/hello_counter")
        .then((res) => res.json())
        .then((res) => res.data);
};

export const fetchAccounts = async (limit, offset) => {
    return fetch(`http://localhost:4000/api/accounts?limit=${limit}&offset=${offset}`)
        .then((res) => res.json())
        .then((res) => res.data);
};

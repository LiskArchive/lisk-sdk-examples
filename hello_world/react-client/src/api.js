import { APIClient } from '@liskhq/lisk-api-client';

const API_BASEURL = 'http://localhost:4000';

export const api = new APIClient([API_BASEURL]);

export const fetchHelloCounter = async () => {
    return fetch("http://localhost:8080/api/hello_counter")
        .then((res) => res.json())
        .then((res) => res.data);
};


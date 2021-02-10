import { APIClient } from '@liskhq/lisk-api-client';

const API_BASEURL = 'http://localhost:4000';

export const api = new APIClient([API_BASEURL]);

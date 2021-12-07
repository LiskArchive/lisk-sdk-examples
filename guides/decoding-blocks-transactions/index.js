const { apiClient, codec, blockSchema } = require('@liskhq/lisk-sdk');
let clientCache;

const getClient = async () => {
  if (!clientCache) {
    clientCache = await apiClient.createWSClient('ws://localhost:8080/ws');
  }
  return clientCache;
};


//const apiRequest = async () => {
//  const client = await getClient();
//  return client;
//};

getClient().then((client) => {
  client.subscribe('app:block:new', ( data ) => {
    console.log('new block:',data);
    codec.codec.decode(data, 
  });
});

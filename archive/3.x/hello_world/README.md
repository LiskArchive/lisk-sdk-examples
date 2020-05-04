# Hello World

This is a Hello World application created using alpha version of `lisk-sdk`.
Find the [full step by step guide here](https://lisk.io/documentation/start/tutorials/hello-world).

#### Install dependencies:

```
npm ci
```

#### Start node:

```
node index.js | npx bunyan -o short
```

#### Post a custom transaction to `/api/transactions`:

##### Example:
```
curl -XPOST -H "Content-type: application/json" -d '{
   "id":"17201273500760578616",
   "amount":"0",
   "type":10,
   "timestamp":104523093,
   "senderPublicKey":"c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f",
   "senderId":"16313739661670634666L",
   "recipientId":"10881167371402274308L",
   "fee":"100000000",
   "signature":"bcb64b1d2efa0450f143296eb0d9ffd5159fc04f9d3f1d3a95c261912632db7910d05e3be4c34cfc46f001ebdba66b8c17cbaddb0df4ef31245b4ab0270c3e00",
   "signatures":[],
   "asset":{"hello":"world"}
}' http://localhost:4000/api/transactions
```

#### Verify the transaction by querying endpoint `/api/transactions?id=`:
```
curl -s http://localhost:4000/api/transactions?id=17201273500760578616
```

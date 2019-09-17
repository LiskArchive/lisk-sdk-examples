# Cashback

This is a simple use-case application created using alpha version of `lisk-sdk`.

Casback application extends the Transfer Transaction of SDK by adding an additional `cashback` feature - with every balance transfer, 10% of transferred amount goes back to the sender's account increasing the total tokens' supply in the network.

## Usage

Please visit our [comprehensive tutorial](https://github.com/LiskHQ/lisk-docs/blob/master/start/tutorials/cashback.md) for a full explanation of how to build this example step by step.

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
    "type":11,
    "id":"13427241074692915298",
    "amount":"200000000",
    "timestamp":104521537,
    "senderPublicKey":"c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f",
    "senderId":"16313739661670634666L",
    "recipientId":"10881167371402274308L",
    "fee":"10000000",
    "signature":"eb80710f2ed124707f9dd71063cd2ef42c5e835a18672090ecf15f58a32055924731e53842d60ab7b6827048de62b27bab4401f5a5bb6dc00391143a1e1e0309",
    "signatures":[],
    "asset":{}
}' http://localhost:4000/api/transactions
```

#### Verify the transaction by querying endpoint `/api/transactions?id=`:
```
curl -s http://localhost:4000/api/transactions?id=13427241074692915298
```

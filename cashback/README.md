# Cashback

This is a simple use-case application created using lisk-sdk@alpha.

Casback application extends the Transfer Transaction of SDK by adding an additional "cashback" feature - with every balance transfer. 10% of transferred amount goes back to the sender's account increasing the total tokens' supply in the network.

## Usage

Please visit our [comprehensive tutorial](https://github.com/LiskHQ/lisk-docs/blob/master/start/tutorials/cashback.md) for a full explaination of how to build this example.

Install dependencies: 

```
npm i lisk-sdk 
```

Start node:

```
node ./src/index | npx bunyan -o short
```

Post a custom transaction to `/api/transactions`:

Example:
```
{   
    "type":9,
    "id":"13311755314561666527",
    "amount":"100000000000000",
    "timestamp":93891325,
    "senderPublicKey":"d1ba3238c3fb14c811634ec4723f9c0095dcbf8117104695584ab95f940e393f",
    "senderId":"750765602177534752L",
    "recipientId":"10881167371402274308L",
    "fee":"100000000",
    "signature":"946a2b75886c94e5ce4df30a7654b0a33f8a11f2007632421820b258a5186d55407ea989b41e12a179409271fd40144415f0b2e1e0792f4f9784a2f6c4131001",
    "signatures":[],
    "asset":{}
}
```

## Hello World
This is the reference implementation for the Hello World example, find the [full step by step guide here](https://github.com/LiskHQ/lisk-sdk-examples/tree/RachBLondon-patch-1/hello_world).

If you have gi cloned this repo - you can install the dependencies:

```
npm i 
```
To start a node:
```
node ./src/index | npx bunyan -o short
```
Post a custom transaction to /api/transactions:


```
{  
   "id":"1199714748623931346",
   "amount":"0",
   "type":10,
   "timestamp":0,
   "senderPublicKey":"c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f",
   "senderId":"16313739661670634666L",
   "recipientId":"10881167371402274308L",
   "fee":"100000000",
   "signature":"e6da5923ee9b769bd5624612af536ca4348d5b32c4552a05161a356e472b8708487022fd4e9787a1b7e548a98c64341f52f2b8b12a39d4115f820b8f01064003",
   "signatures":[],
   "asset":{  
      "hello":"world"
   }
}
```

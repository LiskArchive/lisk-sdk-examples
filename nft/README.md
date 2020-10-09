# NFT Demo

This is a NFT Blockchain application created using `Version 5` of `lisk-sdk`.

## Install dependencies

```bash
cd blockchain_app && npm ci
cd frontend_app && npm ci
```

## Start node

```bash
cd blockchain_app; node index.js
```

## Start frontend

```bash
cd frontend_app; npm start
```

### Test transactions

Follow these steps to test it:

1. In the UI from speed dial, click on first option to get some random account.
2. Copy the address and passphrase to somewhere else.
3. Now choose second option from speed dial and transfer funds to that account. You can use genesis account passphrase for it.
4. Repeat the above steps to create another account.
5. Now choose third option from speed dial to create an NFT Token.
6. Provide initial value, purchase margin, fee and the passphrase of first account to sign the transaction.
7. Once that is done and you refresh the page, you will see an NFT token on the home page.
8. Later you can click on the purchase button of the token test the purchase transaction.

## Caveat

1. Note the frontend app is not auto-refreshed right now. Once you notice the block height change you have to refresh it manually.
2. The frontend app is not keeping track of account nonce, so try to sending one transaction from one account in a block.
3. The NFT token transfer transaction is not yet implemented in frontend, feel free to contribute.

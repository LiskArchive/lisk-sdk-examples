# Lisk Bills
Starts Lisk Core network and registers two custom transactions `InvoiceTransaction` and `PaymentTransaction` (Type `13` and `14`).
This network is used for the `Lisk Bills` proof of concept.

## Installation
> Before installing the Lisk SDK, make sure to follow the instructions in the [Lisk SDK - Pre-Install](https://github.com/LiskHQ/lisk-docs/blob/development/lisk-sdk/introduction.md#pre-installation) section.

To install the server dependencies, run:

```sh
npm i 
```

## Run Server
To start the server, run:

```sh
node index.js | npx bunyan -o short
```

## Run Client

To start the client follow [/invoice/client/README.md](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/invoice/client/README.md)

const express = require('express');
const bodyParser = require('body-parser');
const accounts = require('./accounts.json');
const { APIClient } = require('@liskhq/lisk-api-client');
const HelloTransaction = require('../hello_transaction');
const transactions = require('@liskhq/lisk-transactions');
const cryptography = require('@liskhq/lisk-cryptography');
const { Mnemonic } = require('@liskhq/lisk-passphrase');

const networkIdentifier = cryptography.getNetworkIdentifier(
    "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
    "Lisk",
);

// Constants
const API_BASEURL = 'http://localhost:4000';
const PORT = 3000;

// Initialize
const app = express();
const api = new APIClient([API_BASEURL]);

app.locals.payload = {
    tx: null,
    res: null,
};

// Configure Express
app.set('view engine', 'pug');
app.use(express.static('public'));

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Utils */
const dateToLiskEpochTimestamp = date => (
    Math.floor(new Date(date).getTime() / 1000) - Math.floor(new Date(Date.UTC(2016, 4, 24, 17, 0, 0, 0)).getTime() / 1000)
);

/* Routes */
app.get('/', (req, res) => {
    res.render('index');
});

/**
 * Request all accounts
 */
app.get('/accounts', async(req, res) => {
    let offset = 0;
    let accounts = [];
    const accountsArray = [];

    do {
        const retrievedAccounts = await api.accounts.get({ limit: 100, offset });
        accounts = retrievedAccounts.data;
        accountsArray.push(...accounts);

        if (accounts.length === 100) {
            offset += 100;
        }
    } while (accounts.length === 100);


    res.render('accounts', { accounts: accountsArray });
});

/**
 * Request all blocks
 */
app.get('/blocks', async(req, res) => {
    let offset = 0;
    let blocks = [];
    const blocksArray = [];

    do {
        const retrievedBlocks = await api.blocks.get({ limit: 100, offset });
        blocks = retrievedBlocks.data;
        blocksArray.push(...blocks);

        if (blocks.length === 100) {
            offset += 100;
        }
    } while (blocks.length === 100);


    res.render('blocks', { blocks: blocksArray });
});

/**
 * Request all transactions
 */
app.get('/transactions', async(req, res) => {
    let offset = 0;
    let txs = [];
    const transactionsArray = [];

    do {
        const retrievedTransactions = await api.transactions.get({ limit: 100, offset });
        txs = retrievedTransactions.data;
        transactionsArray.push(...txs);

        if (txs.length === 100) {
            offset += 100;
        }
    } while (txs.length === 100);

    // Sort desc
    transactionsArray.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;

        if (a.timestamp < b.timestamp) return 1;

        if (a.timestamp === b.timestamp) return 0;
    });

    res.render('transactions', { transactions: transactionsArray });
});

app.get('/hello-accounts', async(req, res) => {
    let offset = 0;
    let accounts = [];
    let accountsArray = [];

    do {
        const retrievedAccounts = await api.accounts.get({ limit: 100, offset });
        accounts = retrievedAccounts.data;
        accountsArray.push(...accounts);

        if (accounts.length === 100) {
            offset += 100;
        }
    } while (accounts.length === 100);

    let assetAccounts = [];
    for (var i = 0; i < accountsArray.length; i++) {
        let accountAsset = accountsArray[i].asset;
        if (accountAsset && Object.keys(accountAsset).indexOf("hello") > -1){
            assetAccounts.push(accountsArray[i]);
        }
    }

    res.render('hello-accounts', { accounts: assetAccounts });
});

/**
 * Request specific account (same page)
 */
app.get('/accounts/:address', async(req, res) => {
    const { data: accounts } = await api.accounts.get({ address: req.params.address });
    res.render('accounts', { accounts });
});

/**
 * Request faucet page for funding accounts from genesis
 */
app.get('/faucet', async(req, res) => {
    res.render('faucet');
});

/**
 * Request page for creating a new hello transaction
 */
app.get('/post-hello', async(req, res) => {
    res.render('post-hello');
});

/**
 * Request page for creating a new transfer transaction
 */
app.get('/transfer', async(req, res) => {
    res.render('transfer');
});

/**
 * Page for displaying responses
 */
app.get('/payload', async(req, res) => {
    res.render('payload', { transaction: res.app.locals.payload.tx, response: res.app.locals.payload.res });
});

/**
 * Request HelloTransaction transactions
 */
app.get('/hello-transactions', async(req, res) => {
    const { data: transactions } = await api.transactions.get({ type: HelloTransaction.TYPE });

    // Sort desc
    transactions.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;

        if (a.timestamp < b.timestamp) return 1;

        if (a.timestamp === b.timestamp) return 0;
    });

    res.render('hello-transactions', { transactions });
});

/**
 * Request specific HelloTransaction transactions
 */
app.get('/hello-transactions/:senderId', async(req, res) => {
    const { data: transactions } = await api.transactions.get({ type: HelloTransaction.TYPE, senderId: req.params.senderId });

    // Sort desc
    transactions.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;

        if (a.timestamp < b.timestamp) return 1;

        if (a.timestamp === b.timestamp) return 0;
    });

    res.render('hello', { transactions });
});

app.get('/create', async(req, res) => {
    const getPacketCredentials = () => {
        const passphrase = Mnemonic.generateMnemonic();
        const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(
            passphrase
        );
        const credentials = {
            address: cryptography.getAddressFromPublicKey(keys.publicKey),
            passphrase: passphrase,
            publicKey: keys.publicKey,
            privateKey: keys.privateKey
        };
        return credentials;
    };

    const packetCredentials = getPacketCredentials();
    res.render('create', { packetCredentials });
});

app.post('/post-hello', function (req, res) {
    const helloString = req.body.hello;
    const passphrase = req.body.passphrase;

    const helloTransaction = new HelloTransaction({
        asset: {
            hello: helloString,
        },
        networkIdentifier: networkIdentifier,
        timestamp: dateToLiskEpochTimestamp(new Date()),
    });

    helloTransaction.sign(passphrase);

    api.transactions.broadcast(helloTransaction.toJSON()).then(response => {
        res.app.locals.payload = {
            res: response.data,
            tx: helloTransaction.toJSON(),
        };
        console.log("++++++++++++++++ API Response +++++++++++++++++");
        console.log(response.data);
        console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
        console.log(helloTransaction.stringify());
        console.log("++++++++++++++++ End Script +++++++++++++++++");
        res.redirect('/payload');
    }).catch(err => {
        console.log(JSON.stringify(err.errors, null, 2));
        res.app.locals.payload = {
            res: err,
            tx: helloTransaction.toJSON(),
        };
        res.redirect('/payload');
    });
});;

/*
* Transfers token from the genesis account to another account.
*/
app.post('/faucet', function (req, res) {
    const address = req.body.address;
    const amount = req.body.amount;

    const fundTransaction = new transactions.TransferTransaction({
        asset: {
            recipientId: address,
            amount: transactions.utils.convertLSKToBeddows(amount),
        },
        networkIdentifier: networkIdentifier,
        timestamp: dateToLiskEpochTimestamp(new Date()),
    });

    //The TransferTransaction is signed by the Genesis account
    fundTransaction.sign(accounts.genesis.passphrase);
    api.transactions.broadcast(fundTransaction.toJSON()).then(response => {
        res.app.locals.payload = {
            res: response.data,
            tx: fundTransaction.toJSON(),
        };
        console.log("++++++++++++++++ API Response +++++++++++++++++");
        console.log(response.data);
        console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
        console.log(fundTransaction.stringify());
        console.log("++++++++++++++++ End Script +++++++++++++++++");
        res.redirect('/payload');
    }).catch(err => {
        console.log(JSON.stringify(err.errors, null, 2));
        res.app.locals.payload = {
            res: err,
            tx: fundTransaction.toJSON(),
        };
        res.redirect('/payload');
    });
});
/*
* Transfers token from the one account to another account.
*/
app.post('/transfer', function (req, res) {
    const address = req.body.address;
    const amount = req.body.amount;

    const transferTransaction = new transactions.TransferTransaction({
        asset: {
            recipientId: address,
            amount: transactions.utils.convertLSKToBeddows(amount),
        },
        networkIdentifier: networkIdentifier,
        timestamp: dateToLiskEpochTimestamp(new Date()),
    });

    //The TransferTransaction is signed by the Genesis account
    transferTransaction.sign(req.body.passphrase);
    api.transactions.broadcast(transferTransaction.toJSON()).then(response => {
        res.app.locals.payload = {
            res: response.data,
            tx: transferTransaction.toJSON(),
        };
        console.log("++++++++++++++++ API Response +++++++++++++++++");
        console.log(response.data);
        console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
        console.log(transferTransaction.stringify());
        console.log("++++++++++++++++ End Script +++++++++++++++++");
        res.redirect('/payload');
    }).catch(err => {
        console.log(JSON.stringify(err.errors, null, 2));
        res.app.locals.payload = {
            res: err,
            tx: transferTransaction.toJSON(),
        };
        res.redirect('/payload');
    });
});

app.listen(PORT, () => console.info(`Explorer app listening on port ${PORT}!`));

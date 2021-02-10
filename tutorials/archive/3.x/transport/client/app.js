const express = require('express');
const bodyParser = require('body-parser');
const { APIClient } = require('@liskhq/lisk-api-client');
const accounts = require('../client/accounts.json');
const RegisterPacketTransaction = require('../transactions/register-packet');
const LightAlarmTransaction = require('../transactions/light-alarm');
const StartTransportTransaction = require('../transactions/start-transport');
const FinishTransportTransaction = require('../transactions/finish-transport');
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

app.get('/packet-accounts', async(req, res) => {
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
        if (accountAsset && Object.keys(accountAsset).length > 0){
            assetAccounts.push(accountsArray[i]);
        }
    }

    res.render('packet-accounts', { accounts: assetAccounts });
});

/**
 * Request specific account (same page)
 */
app.get('/accounts/:address', async(req, res) => {
    const { data: accounts } = await api.accounts.get({ address: req.params.address });
    res.render('accounts', { accounts });
});

/**
 * Request page for registring new packet
 */
app.get('/post-register-packet', async(req, res) => {
    res.render('post-register-packet');
});

/**
 * Request faucet page for funding accounts from genesis
 */
app.get('/faucet', async(req, res) => {
    res.render('faucet');
});

/**
 * Request page for starting transport transaction
 */
app.get('/post-start-transport', async(req, res) => {
    res.render('post-start-transport');
});

/**
 * Request page for sending finish transport transaction
 */
app.get('/post-finish-transport', async(req, res) => {
    res.render('post-finish-transport');
});

/**
 * Page for displaying responses
 */
app.get('/payload', async(req, res) => {
    res.render('payload', { transaction: res.app.locals.payload.tx, response: res.app.locals.payload.res });
});

/**
 * Request LightAlarmTransaction transactions
 */
app.get('/light-alarm', async(req, res) => {
    const { data: transactions } = await api.transactions.get({ type: LightAlarmTransaction.TYPE });

    // Sort desc
    transactions.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;

        if (a.timestamp < b.timestamp) return 1;

        if (a.timestamp === b.timestamp) return 0;
    });

    res.render('light-alarm', { transactions });
});

/**
 * Request specific LightAlarmTransaction transactions
 */
app.get('/light-alarm/:senderId', async(req, res) => {
    const { data: transactions } = await api.transactions.get({ type: LightAlarmTransaction.TYPE, senderId: req.params.senderId });

    // Sort desc
    transactions.sort((a, b) => {
        if (a.timestamp > b.timestamp) return -1;

        if (a.timestamp < b.timestamp) return 1;

        if (a.timestamp === b.timestamp) return 0;
    });

    res.render('light-alarm', { transactions });
});

app.get('/initialize', async(req, res) => {
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

    let tx = new transactions.TransferTransaction({
        asset: {
            amount: '1',
            recipientId: packetCredentials.address,
        },
        networkIdentifier: networkIdentifier,
    });

    tx.sign('creek own stem final gate scrub live shallow stage host concert they'); // Genesis account with address: 11237980039345381032L
    res.render('initialize', { packetCredentials });

    api.transactions.broadcast(tx.toJSON()).then(res => {
        console.log("++++++++++++++++ API Response +++++++++++++++++");
        console.log(res.data);
        console.log("++++++++++++++++ Credentials +++++++++++++++++");
        console.dir(packetCredentials);
        console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
        console.log(tx.stringify());
        console.log("++++++++++++++++ End Script +++++++++++++++++");
    }).catch(err => {
        console.log(JSON.stringify(err.errors, null, 2));
    });

    res.end()
});

app.post('/post-register-packet', function (req, res) {
    const packetId = req.body.packetid;
    const postage = req.body.postage;
    const security = req.body.security;
    const minTrust = +req.body.mintrust;
    const recipientId = req.body.recipient;
    const passphrase = req.body.passphrase;

    const registerPackageTransaction = new RegisterPacketTransaction({
        asset: {
            security: transactions.utils.convertLSKToBeddows(security),
            minTrust,
            postage: transactions.utils.convertLSKToBeddows(postage),
            packetId,
            recipientId,
        },
        networkIdentifier: networkIdentifier,
        timestamp: dateToLiskEpochTimestamp(new Date()),
    });

    registerPackageTransaction.sign(passphrase);

    api.transactions.broadcast(registerPackageTransaction.toJSON()).then(response => {
        res.app.locals.payload = {
            res: response.data,
            tx: registerPackageTransaction.toJSON(),
        };
        console.log("++++++++++++++++ API Response +++++++++++++++++");
        console.log(response.data);
        console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
        console.log(registerPackageTransaction.stringify());
        console.log("++++++++++++++++ End Script +++++++++++++++++");
        res.redirect('/payload');
    }).catch(err => {
        console.log(JSON.stringify(err.errors, null, 2));
        res.app.locals.payload = {
            res: err,
            tx: registerPackageTransaction.toJSON(),
        };
        res.redirect('/payload');
    });
});

app.post('/post-start-transport', function (req, res) {
    const recipientId = req.body.recipient;
    const passphrase = req.body.passphrase;

    // Send start transport transaction
    const startTransportTransaction = new StartTransportTransaction({
        asset: {
            recipientId,
        },
        networkIdentifier: networkIdentifier,
        timestamp: dateToLiskEpochTimestamp(new Date()),
    });

    startTransportTransaction.sign(passphrase);

    api.transactions.broadcast(startTransportTransaction.toJSON()).then(response => {
        res.app.locals.payload = {
            res: response.data,
            tx: startTransportTransaction.toJSON(),
        };
        console.log("++++++++++++++++ API Response +++++++++++++++++");
        console.log(response.data);
        console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
        console.log(startTransportTransaction.stringify());
        console.log("++++++++++++++++ End Script +++++++++++++++++");
        res.redirect('/payload');
    }).catch(err => {
        console.log(JSON.stringify(err.errors, null, 2));
        res.app.locals.payload = {
            res: err,
            tx: startTransportTransaction.toJSON(),
        };
        res.redirect('/payload');
    });
});

app.post('/faucet', function (req, res) {
    const address = req.body.address;
    const amount = req.body.amount;

    const fundTransaction = new transactions.TransferTransaction({
        asset: {
            recipientId: address,
            amount: transactions.utils.convertLSKToBeddows(amount),
        },
        networkIdentifier: networkIdentifier,
    });

    fundTransaction.sign(accounts.sender.passphrase); // Genesis account
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

app.post('/post-finish-transport', function (req, res) {
    const recipient = req.body.recipient;
    const status = req.body.status;
    const passphrase = req.body.passphrase;

    const finishTransportTransaction = new FinishTransportTransaction({
        asset: {
            recipientId: recipient,
            status,
        },
        networkIdentifier: networkIdentifier,
        timestamp: dateToLiskEpochTimestamp(new Date()),
    });

    finishTransportTransaction.sign(passphrase);

    api.transactions.broadcast(finishTransportTransaction.toJSON()).then(response => {
        res.app.locals.payload = {
            res: response.data,
            tx: finishTransportTransaction.toJSON(),
        };
        console.log("++++++++++++++++ API Response +++++++++++++++++");
        console.log(response.data);
        console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
        console.log(finishTransportTransaction.stringify());
        console.log("++++++++++++++++ End Script +++++++++++++++++");
        res.redirect('/payload');
    }).catch(err => {
        console.log(JSON.stringify(err.errors, null, 2));
        res.app.locals.payload = {
            res: err,
            tx: finishTransportTransaction.toJSON(),
        };
        res.redirect('/payload');
    });
});

app.listen(PORT, () => console.info(`Explorer app listening on port ${PORT}!`));

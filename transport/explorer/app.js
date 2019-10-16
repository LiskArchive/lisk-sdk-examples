const express = require('express');
const bodyParser = require('body-parser');
const { APIClient } = require('@liskhq/lisk-api-client');
const RegisterPacketTransaction = require('../transactions/register-packet');
const LightAlarmTransaction = require('../transactions/light-alarm');

// Constants
const API_BASEURL = 'http://localhost:4000';
const PORT = 3000;

// Initialize
const app = express();
const api = new APIClient([API_BASEURL]);

// Configure Express
app.set('view engine', 'pug')

// parse application/json
app.use(bodyParser.json());

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
 * Request specific account (same page)
 */
app.get('/accounts/:address', async(req, res) => {
    const { data: accounts } = await api.accounts.get({ address: req.params.address });
    res.render('accounts', { accounts });
});

/**
 * Request RegisterPackage transactions
 */
app.get('/register-packet', async(req, res) => {
    const { data: transactions } = await api.transactions.get({ type: RegisterPacketTransaction.TYPE });

    res.render('register-packet', { transactions });
});

/**
 * Request specific RegisterPackage transactions
 */
app.get('/register-packet/:senderId', async(req, res) => {
    const { data: transactions } = await api.transactions.get({ type: RegisterPacketTransaction.TYPE, senderId: req.params.senderId });

    res.render('register-packet', { transactions });
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

app.listen(PORT, () => console.info(`Explorer app listening on port ${PORT}!`));

const express = require('express');
const bodyParser = require('body-parser');
const { APIClient } = require('@liskhq/lisk-api-client');

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

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => console.info(`Explorer app listening on port ${PORT}!`));

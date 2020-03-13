import React, { Component } from 'react';
const { APIClient } = require('@liskhq/lisk-api-client');
const accounts = require('../accounts.json');
const transactions = require('@liskhq/lisk-transactions');
const cryptography = require('@liskhq/lisk-cryptography');

const networkIdentifier = cryptography.getNetworkIdentifier(
    "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
    "Lisk",
);

// Constants
const API_BASEURL = 'http://localhost:4000';

// Initialize
const api = new APIClient([API_BASEURL]);

/* Utils */
const dateToLiskEpochTimestamp = date => (
    Math.floor(new Date(date).getTime() / 1000) - Math.floor(new Date(Date.UTC(2016, 4, 24, 17, 0, 0, 0)).getTime() / 1000)
);

class Faucet extends Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '',
            amount: '',
            response: { meta: { status: false }},
            transaction: {},
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const fundTransaction = new transactions.TransferTransaction({
            asset: {
                recipientId: this.state.address,
                amount: transactions.utils.convertLSKToBeddows(this.state.amount),
            },
            networkIdentifier: networkIdentifier,
            timestamp: dateToLiskEpochTimestamp(new Date()),
        });

        //The TransferTransaction is signed by the Genesis account
        fundTransaction.sign(accounts.genesis.passphrase);
        api.transactions.broadcast(fundTransaction.toJSON()).then(response => {
            this.setState({response:response});
            this.setState({transaction:fundTransaction});
        }).catch(err => {
            console.log(JSON.stringify(err.errors, null, 2));
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Address:
                        <input type="text" id="address" name="address" onChange={this.handleChange} />
                    </label>
                    <label>
                        Amount (1 = 10^8 tokens):
                        <input type="text" id="amount" name="amount" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.response.meta.status &&
                    <div>
                        <p>Transaction: {JSON.stringify(this.state.transaction)}</p>
                        <p>Response: {JSON.stringify(this.state.response)}</p>
                    </div>
                }
            </div>
        );
    }
}
export default Faucet;

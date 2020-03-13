import React, { Component } from 'react';
import HelloTransaction from '../transactions/hello_transaction';
const { APIClient } = require('@liskhq/lisk-api-client');
const cryptography = require('@liskhq/lisk-cryptography');

const networkIdentifier = cryptography.getNetworkIdentifier(
    "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
    "Lisk",
);

const API_BASEURL = 'http://localhost:4000';

const api = new APIClient([API_BASEURL]);

const dateToLiskEpochTimestamp = date => (
    Math.floor(new Date(date).getTime() / 1000) - Math.floor(new Date(Date.UTC(2016, 4, 24, 17, 0, 0, 0)).getTime() / 1000)
);

class Transfer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hello: '',
            passphrase: '',
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

        const helloTransaction = new HelloTransaction({
            asset: {
                hello: this.state.hello,
            },
            networkIdentifier: networkIdentifier,
            timestamp: dateToLiskEpochTimestamp(new Date()),
        });

        helloTransaction.sign(this.state.passphrase);
        api.transactions.broadcast(helloTransaction.toJSON()).then(response => {
            this.setState({response:response});
            this.setState({transaction:helloTransaction});
        }).catch(err => {
            console.log(JSON.stringify(err, null, 2));
        });
    }

    render() {
        return (
            <div>
                <h2>Hello</h2>
                <p>Send a Hello transaction.</p>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Hello message:
                        <input type="text" id="hello" name="hello" onChange={this.handleChange} />
                    </label>
                    <label>
                        Passphrase:
                        <input type="text" id="passphrase" name="passphrase" onChange={this.handleChange} />
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
export default Transfer;

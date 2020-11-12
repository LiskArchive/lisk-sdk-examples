import React, { Component } from 'react';
import * as api from '../api.js';
import accounts from '../accounts.json';
import { transfer } from '../transactions/transfer';

class Faucet extends Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '',
            amount: '',
            fee: '',
            transaction: {},
            response: {}
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const res = await transfer({
            recipientAddress: this.state.address,
            amount: this.state.amount,
            fee: '0.1',
            passphrase: accounts.genesis.passphrase,
            networkIdentifier: 'f9aa0b17154aa27aa17f585b96b19a6559ed6ef3805352188312912c7b9192e5',
            minFeePerByte: 1000,
        });

        await api.sendTransactions(res.tx).then((response) => {
            this.setState({
              transaction:res.tx,
              response: { status: response.status, message: response.statusText}
            });
        });
    }

    render() {
        return (
            <div>
                <h2>Faucet</h2>
                <p>The faucet transfers tokens from the genesis account to another.</p>
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
                {this.state.transaction &&
                    <div>
                        <pre>Transaction: {JSON.stringify(this.state.transaction, null, 2)}</pre>
                        <pre>Response: {JSON.stringify(this.state.response, null, 2)}</pre>
                    </div>
                }
            </div>
        );
    }
}
export default Faucet;

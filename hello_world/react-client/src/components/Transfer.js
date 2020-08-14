import React, { Component } from 'react';
import { api } from '../api.js';
import { cryptography, transactions } from '@liskhq/lisk-client';
import {transfer, utils} from "@liskhq/lisk-transactions";
import accounts from "../accounts";

const networkIdentifier = cryptography.getNetworkIdentifier(
    "19074b69c97e6f6b86969bb62d4f15b888898b499777bda56a3a2ee642a7f20a",
    "Lisk",
);

class Transfer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '',
            amount: '',
            nonce: '',
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

        const transferTransaction = new transactions.TransferTransaction({
            asset: {
                recipientId: this.state.address,
                amount: transactions.utils.convertLSKToBeddows(this.state.amount),
            },
            fee: utils.convertLSKToBeddows('0.1'),
            nonce: this.state.nonce,
        });
        console.log("=========  HELLO  ========");
        console.dir(transferTransaction);
        transferTransaction.sign(networkIdentifier,this.state.passphrase);
        console.dir(transferTransaction);

        api.transactions.broadcast(transferTransaction.toJSON()).then(response => {
            this.setState({response:response});
            this.setState({transaction:transferTransaction});
        }).catch(err => {
            console.log(JSON.stringify(err.errors, null, 2));
        });
    }

    render() {
        return (
            <div>
                <h2>Transfer</h2>
                <p>Send tokens from one account to another.</p>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Recipient:
                        <input type="text" id="address" name="address" onChange={this.handleChange} />
                    </label>
                    <label>
                        Amount (1 = 10^8 tokens):
                        <input type="text" id="amount" name="amount" onChange={this.handleChange} />
                    </label>
                    <label>
                        Nonce:
                        <input type="text" id="nonce" name="nonce" onChange={this.handleChange} />
                    </label>
                    <label>
                        Passphrase:
                        <input type="text" id="passphrase" name="passphrase" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.response.meta.status &&
                <div>
                    <pre>Transaction: {JSON.stringify(this.state.transaction, null, 2)}</pre>
                    <p>Response: {JSON.stringify(this.state.response, null, 2)}</p>
                </div>
                }
            </div>
        );
    }
}
export default Transfer;

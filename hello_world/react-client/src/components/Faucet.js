import React, { Component } from 'react';
import { api } from '../api.js';
import accounts from '../accounts.json';
import{ transfer, utils } from '@liskhq/lisk-transactions';
import * as cryptography from '@liskhq/lisk-cryptography';

const networkIdentifier = cryptography.getNetworkIdentifier(
    "19074b69c97e6f6b86969bb62d4f15b888898b499777bda56a3a2ee642a7f20a", //payloadHash
    "Lisk", //Community Identifier
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


        api.accounts.get({address: accounts.genesis.address}).then(response1 => {

            const nonce = parseInt(response1.data[0].nonce);
            const fundTransaction = transfer({
                amount: utils.convertLSKToBeddows(this.state.amount),
                recipientId: this.state.address,
                passphrase: accounts.genesis.passphrase,
                networkIdentifier,
                fee: utils.convertLSKToBeddows('0.1'),
                nonce: nonce.toString(),
            });

            //The TransferTransaction is signed by the Genesis account
            api.transactions.broadcast(fundTransaction).then(response2 => {
                this.setState({response:response2});
                this.setState({transaction:fundTransaction});
            }).catch(err => {
                console.log(JSON.stringify(err.errors, null, 2));
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
export default Faucet;

import React, { Component } from 'react';
import {
    HelloTransaction,
} from 'lisk-hello-transactions';
import { api } from '../api.js';
import { createHelloTx } from '../transactions/create_hello_tx';
import { cryptography } from '@liskhq/lisk-client';
import {utils} from "@liskhq/lisk-transactions";
import {createNFTToken} from "../../../../nft/frontend_app/src/utils/transactions/create_nft_token";

const networkIdentifier = cryptography.getNetworkIdentifier(
    "19074b69c97e6f6b86969bb62d4f15b888898b499777bda56a3a2ee642a7f20a",
    "Lisk",
);

class Hello extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hello: '',
            fee: '',
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

        const res = await createHelloTx({
            ...data,
            networkIdentifier: nodeInfo.networkIdentifier,
            minFeePerByte: nodeInfo.minFeePerByte,
        });
        await api.sendTransactions(res.tx);
        const helloTransaction = new HelloTransaction({
            asset: {
                hello: this.state.hello,
            },
            fee: this.state.fee.toString(),
            nonce: this.state.nonce.toString(),
        });

        helloTransaction.sign(networkIdentifier,this.state.passphrase);

        if ( helloTransaction.minFee() > helloTransaction.fee) {
            this.setState({response:"Please provide a higher fee. Minimum fee for the current transaction: " + helloTransaction.minFee()});
            this.setState({transaction:helloTransaction});
        } else {

            api.transactions.broadcast(helloTransaction.toJSON()).then(response => {
                this.setState({response:response});
                this.setState({transaction:helloTransaction});
            }).catch(err => {
                console.log(JSON.stringify(err, null, 2));
            });
        }
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
                        Fee:
                        <input type="text" id="fee" name="fee" onChange={this.handleChange} />
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
export default Hello;

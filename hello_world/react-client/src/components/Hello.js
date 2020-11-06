import React, { Component } from 'react';
import * as api from '../api.js';
import { createHelloTx } from '../transactions/create_hello_tx';

class Hello extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hello: '',
            fee: '',
            passphrase: '',
            transaction: {},
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const res = await createHelloTx({
            helloString: this.state.hello,
            fee: this.state.fee.toString(),
            passphrase: this.state.passphrase,
            networkIdentifier: 'f9aa0b17154aa27aa17f585b96b19a6559ed6ef3805352188312912c7b9192e5',
            minFeePerByte: 1000,
        });
        await api.sendTransactions(res.tx).then((response) => {
            this.setState({response: response});
            this.setState({transaction: res.tx});
        });
    };

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
                        Passphrase:
                        <input type="text" id="passphrase" name="passphrase" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div>
                    <pre>Transaction: {JSON.stringify(this.state.transaction, null, 2)}</pre>
                    <p>Response: {JSON.stringify(this.state.response, null, 2)}</p>
                </div>
            </div>
        );
    }
}
export default Hello;

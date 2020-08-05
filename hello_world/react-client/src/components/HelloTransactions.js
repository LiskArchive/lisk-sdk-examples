import React, { Component } from 'react';
import { api } from '../api.js';
//import HelloTransaction from '../transactions/hello_transaction';
import {
    HelloTransaction,
} from 'lisk-hello-transactions';

class HelloTransactions extends Component {

    constructor(props) {
        super(props);

        this.state = { data: [] };
    }

    componentDidMount() {
        api.transactions.get({ type: HelloTransaction.TYPE }).then((data) => {
            this.setState({ data });
        });
    }

    render() {
        return (
            <div>
                <h2>All Hello Transactions</h2>
                <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </div>
        );
    }
}
export default HelloTransactions;

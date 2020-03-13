import React, { Component } from 'react';
import { APIClient } from '@liskhq/lisk-api-client';
import HelloTransaction from '../transactions/hello_transaction';

const API_BASEURL = 'http://localhost:4000';

const api = new APIClient([API_BASEURL]);

class HelloTransactions extends Component {

    constructor(props) {
        super(props);

        this.state = { data: [] };
    }

    async componentDidMount() {
        const transactions  = await api.transactions.get({ type: HelloTransaction.TYPE });

        this.setState({ data: transactions });
    }

    render() {
        return (
            <div>
                <h2>All Hello Transactions</h2>
                <div>{JSON.stringify(this.state.data)}</div>
            </div>
        );
    }
}
export default HelloTransactions;

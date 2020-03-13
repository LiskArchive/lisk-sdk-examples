import React, { Component } from 'react';
const { APIClient } = require('@liskhq/lisk-api-client');

// Constants
const API_BASEURL = 'http://localhost:4000';

// Initialize
const api = new APIClient([API_BASEURL]);

class Transactions extends Component {

    constructor(props) {
        super(props);

        this.state = { data: [] };
    }

    async componentDidMount() {
        let offset = 0;
        let transactions = [];
        const transactionsArray = [];

        do {
            const retrievedTransactions = await api.transactions.get({ limit: 100, offset });
            transactions = retrievedTransactions.data;
            transactionsArray.push(...transactions);

            if (transactions.length === 100) {
                offset += 100;
            }
        } while (transactions.length === 100);

        this.setState({ data: transactionsArray });
    }

    render() {
        return (
            <div>
                <h2>All Transaction</h2>
                <div>{JSON.stringify(this.state.data)}</div>
            </div>
        );
    }
}
export default Transactions;

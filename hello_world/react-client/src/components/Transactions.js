import React, { Component } from 'react';
import { api } from '../api.js';

const getData = async () => {
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

    return transactionsArray;
}

class Transactions extends Component {

    constructor(props) {
        super(props);

        this.state = { data: [] };
    }

    componentDidMount() {
        getData().then((data) => {
            this.setState({ data });
        });
    }

    render() {
        return (
            <div>
                <h2>All Transactions</h2>
                <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </div>
        );
    }
}
export default Transactions;

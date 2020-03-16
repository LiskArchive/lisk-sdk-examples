import React, { Component } from 'react';
import { api } from '../api.js';

class Accounts extends Component {

    constructor(props) {
        super(props);

        this.state = { data: [] };
    }

    async componentDidMount() {
        let offset = 0;
        let accounts = [];
        const accountsArray = [];

        do {
            const retrievedAccounts = await api.accounts.get({ limit: 100, offset });
            accounts = retrievedAccounts.data;
            accountsArray.push(...accounts);

            if (accounts.length === 100) {
                offset += 100;
            }
        } while (accounts.length === 100);

        this.setState({ data: accountsArray });
    }

    render() {
        return (
            <div>
                <h2>All accounts</h2>
                <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </div>
        );
    }
}
export default Accounts;

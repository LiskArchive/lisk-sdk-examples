import React, { Component } from 'react';
const { APIClient } = require('@liskhq/lisk-api-client');

// Constants
const API_BASEURL = 'http://localhost:4000';

// Initialize
const api = new APIClient([API_BASEURL]);

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
                <h2>List of all accounts</h2>
                <div>{JSON.stringify(this.state.data)}</div>
            </div>
        );
    }
}
export default Accounts; // Don’t forget to use export default!

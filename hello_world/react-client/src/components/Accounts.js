import React, { Component } from 'react';

class Accounts extends Component {

    constructor(props) {
        super(props);

        this.state = { credentials: getPacketCredentials() };
    }

    componentDidMount() {
           // const response = await fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=10`);
            //const json = await response.json();
            //this.setState({ data: json });
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

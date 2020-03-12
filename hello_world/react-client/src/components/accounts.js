import React, { Component } from 'react';

class Accounts extends Component {
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


    render() {
        return (
            <div>
                <h2>List of all accounts</h2>
            </div>
        );
    }
}
export default Button; // Don’t forget to use export default!

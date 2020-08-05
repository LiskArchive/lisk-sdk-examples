import React, { Component } from 'react';
import { api } from '../api.js';

const getData = async () => {
    let offset = 0;
    let accounts = [];
    let accountsArray = [];

    do {
        const retrievedAccounts = await api.accounts.get({ limit: 100, offset });
        accounts = retrievedAccounts.data;
        accountsArray.push(...accounts);

        if (accounts.length === 100) {
            offset += 100;
        }
    } while (accounts.length === 100);

    let assetAccounts = [];
    for (var i = 0; i < accountsArray.length; i++) {
        let accountAsset = accountsArray[i].asset;
        if (accountAsset && Object.keys(accountAsset).indexOf("hello") > -1){
            assetAccounts.push(accountsArray[i]);
        }
    }

    return assetAccounts;
}

class HelloAccounts extends Component {

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
                <h2>All Hello accounts</h2>
                <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </div>
        );
    }
}
export default HelloAccounts;

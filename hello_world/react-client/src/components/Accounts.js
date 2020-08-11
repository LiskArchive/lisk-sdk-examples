import React, { Component } from 'react';
import { api } from '../api.js';

const getData = async () => {
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

    return accountsArray;
};

class Accounts extends Component {

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
                <h2>All accounts</h2>
                <section>
                    <ul>
                        {
                            this.state.data.map(item => (
                                <li>
                                    <span>{item.address}</span>
                                    <small>{item.username}</small>

                                    <span>{`Balance: ${item.balance}`}</span>
                                    <span>{`Nonce: ${item.nonce}`}</span>
                                    {/* <pre>{JSON.stringify(this.state.data, null, 2)}</pre> */}
                                </li>
                            ))
                        }
                    </ul>
                </section>
                
            </div>
        );
    }
}
export default Accounts;

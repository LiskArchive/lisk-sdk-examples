import { cryptography } from '@liskhq/lisk-client';
import React, { useState } from 'react';
import * as api from './api.js';

const Account = () => {
    const [state, updateState] = useState({
        address: '',
        account: {},
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        updateState({
            ...state,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const client = await api.getClient();
        const account = await client.account.get(cryptography.getAddressFromBase32Address(state.address));
        updateState({
            ...state,
            account: client.account.toJSON(account),
        });
    };

    return (
        <div>
            <h2>Account</h2>
            <p>Get account details by address.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Address:
                        <input type="text" id="address" name="address" onChange={handleChange} value={state.address} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <div>
                <pre>Account: {JSON.stringify(state.account, null, 2)}</pre>
            </div>
        </div>
    );
}
export default Account;

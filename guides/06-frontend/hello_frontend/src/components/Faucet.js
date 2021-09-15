import React, { useState } from 'react';
import { cryptography, transactions } from '@liskhq/lisk-client';
import * as api from '../api.js';
import accounts from '../accounts.json';

const Faucet = () => {
    const [state, updateState] = useState({
        address: '',
        amount: '',
        transaction: {},
        response: {}
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
        const address = cryptography.getAddressFromBase32Address(state.address);
        const tx = await client.transaction.create({
            moduleID: 2,
            assetID: 0,
            fee: BigInt(transactions.convertLSKToBeddows('0.01')),
            asset: {
                amount: BigInt(transactions.convertLSKToBeddows(state.amount)),
                recipientAddress: address,
                data: '',
            },
        }, accounts.genesisDelegate.passphrase);
        const response = await client.transaction.send(tx);
        updateState({
            transaction: client.transaction.toJSON(tx),
            address: '',
            amount: '',
            response:response
        });
    }

    return (
        <div>
            <h2>Faucet</h2>
            <p>The faucet transfers tokens from the genesis account to another.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Address:
                        <input type="text" id="address" name="address" onChange={handleChange} value={state.address} />
                </label>
                <label>
                    Amount (1 = 10^8 tokens):
                        <input type="text" id="amount" name="amount" onChange={handleChange} value={state.amount} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            {state.transaction &&
                <div>
                    <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                    <pre>Response: {JSON.stringify(state.response, null, 2)}</pre>
                </div>
            }
        </div>
    );
};

export default Faucet;

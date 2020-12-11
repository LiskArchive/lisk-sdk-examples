import React, { useState } from 'react';
import { cryptography, transactions } from '@liskhq/lisk-client';
import * as api from '../api.js';

const Transfer = () => {
    const [state, updateState] = useState({
        address: '',
        amount: '',
        fee: '',
        passphrase: '',
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
            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            asset: {
                amount: BigInt(transactions.convertLSKToBeddows(state.amount)),
                recipientAddress: address,
                data: '',
            },
        }, state.passphrase);
        let err;
        try {
            await client.transaction.send(tx);
        } catch (error) {
            err = error;
        }

        updateState({
            transaction: client.transaction.toJSON(tx),
            response: err,
            address: '',
            amount: '',
            fee: '',
            passphrase: '',
        });
    };

    return (
        <div>
            <h2>Transfer</h2>
            <p>Send tokens from one account to another.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Recipient:
                        <input type="text" id="address" name="address" onChange={handleChange} value={state.address} />
                </label>
                <label>
                    Amount (1 = 10^8 tokens):
                        <input type="text" id="amount" name="amount" onChange={handleChange} value={state.amount} />
                </label>
                <label>
                    Fee:
                        <input type="text" id="fee" name="fee" onChange={handleChange}  value={state.fee} />
                </label>
                <label>
                    Passphrase:
                        <input type="text" id="passphrase" name="passphrase" onChange={handleChange}  value={state.passphrase} />
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
}
export default Transfer;

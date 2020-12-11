import { cryptography, transactions } from '@liskhq/lisk-client';
import React, { Component, useState } from 'react';
import * as api from '../api.js';

const Hello = () => {
    const [state, updateState] = useState({
        hello: '',
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
        const tx = await client.transaction.create({
            moduleID: 1000,
            assetID: 0,
            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            asset: {
                helloString: state.hello,
            },
        }, state.passphrase);

        let err = '';
        try {
            await client.transaction.send(tx);
        } catch (error) {
            err = error;
        }
        updateState({
            transaction: client.transaction.toJSON(tx),
            response: err,
            hello: '',
            fee: '',
            passphrase: '',
        });
    };

    return (
        <div>
            <h2>Hello</h2>
            <p>Send a Hello transaction.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Hello message:
                        <input type="text" id="hello" name="hello" onChange={handleChange} value={state.hello} />
                </label>
                <label>
                    Fee:
                        <input type="text" id="fee" name="fee" onChange={handleChange} value={state.fee} />
                </label>
                <label>
                    Passphrase:
                        <input type="text" id="passphrase" name="passphrase" onChange={handleChange} value={state.passphrase} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <div>
                <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                <pre>Response: {JSON.stringify(state.response, null, 2)}</pre>
            </div>
        </div>
    );
}
export default Hello;

import FixedMenuLayout from '../layout/header';
import React, { useState } from "react";
import { Form, Button, Grid, Container } from 'semantic-ui-react';
import { cryptography, transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';
import { Buffer } from 'buffer';

// Buffer needs to be installed via npm install --save buffer

function Transfer() {
    const [state, updateState] = useState({
        address: 'lsko5v2u2wjswjogxgxdr79c45kewprypouyaky76',
        amount: '10',
        accountInitializationFee: '1',
        fee: '1',
        passphrase: 'weasel balance horse obtain love diary lesson reflect connect scheme decrease wrestle team sphere spring desert quote fever penalty rookie liquid harvest ride omit',
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
        const address = state.address;
        const passphrase = state.passphrase;
        const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, "m/44'/134'/0'");
        const signedTx = await client.transaction.create({
            module: 'token',
            command: 'transfer',

            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            params: {
                tokenID: Buffer.from('0000000000000000', 'hex'),
                amount: BigInt(transactions.convertLSKToBeddows(state.amount)),
                recipientAddress: address,
                accountInitializationFee: BigInt(transactions.convertLSKToBeddows(state.accountInitializationFee)),
                data: 'Please accept this grant from Lisk.'
            }
        }, privateKey);


        console.log("Signed Transaction:\n", signedTx);

        let res;
        try {
            res = await client.transaction.send(signedTx);
        } catch (error) {
            res = error;
        }

        updateState({
            transaction: signedTx,
            response: res,
            address: '',
            amount: '',
            fee: '',
            passphrase: '',
        });
    };

    return (
        <>
            <FixedMenuLayout />
            <Container>
                <h1>Send LSK tokens</h1>
                <p>On this page you can send LSK tokens to any address within the Hello sidechain</p>
                <Grid style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 500 }}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                                <input placeholder="Recipient's Lisk32 Address" id="address" name="address" onChange={handleChange} value={state.address} />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder='Amount (1 = 10^8 tokens):' id="amount" name="amount" onChange={handleChange} value={state.amount} />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder='Fee' id="fee" name="fee" onChange={handleChange} value={state.fee} />
                            </Form.Field>
                            <Form.Field>
                                <input placeholder='Passphrase' id="passphrase" name="passphrase" onChange={handleChange} value={state.passphrase} />
                            </Form.Field>
                            <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
                {state.transaction &&
                    <div>
                        <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                        <pre>Response: {JSON.stringify(state.response, null, 2)}</pre>
                    </div>
                }
            </Container>
        </>

    );
}

export default Transfer;
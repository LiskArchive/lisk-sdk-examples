import FixedMenuLayout from '../layout/header';
import React, { useState } from "react";
import { Form, Button, Grid, Container } from 'semantic-ui-react';
import { cryptography, transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';
import { Buffer } from 'buffer';

function Faucet() {
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
        const address = state.address;
        const passphrase = 'weasel balance horse obtain love diary lesson reflect connect scheme decrease wrestle team sphere spring desert quote fever penalty rookie liquid harvest ride omit';
        const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, "m/44'/134'/0'");
        const signedTx = await client.transaction.create({
            module: 'token',
            command: 'transfer',

            fee: BigInt(transactions.convertLSKToBeddows('0.01')),
            params: {
                tokenID: Buffer.from('0000000000000000', 'hex'),
                amount: BigInt(transactions.convertLSKToBeddows(state.amount)),
                recipientAddress: address,
                accountInitializationFee: BigInt(transactions.convertLSKToBeddows('0.01')),
                data: 'Please accept this grant from Lisk faucet.'
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
                <h1>Faucet</h1>
                <h4>The faucet transfers tokens from the genesis account to another.</h4>
                <div>
                    <Grid style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 500 }}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Field>
                                    <input placeholder="Recipient's Lisk32 Address" id="address" name="address" onChange={handleChange} value={state.address} />
                                </Form.Field>
                                <Form.Field>
                                    <input placeholder='Amount (1 = 10^8 tokens):' id="amount" name="amount" onChange={handleChange} value={state.amount} />
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
                </div>
            </Container>
        </>
    );
}

export default Faucet;
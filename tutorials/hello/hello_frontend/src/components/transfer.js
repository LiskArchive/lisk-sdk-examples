import FixedMenuLayout from '../layout/header';
import React, { useState } from "react";
import { Form, Button, Divider, Container } from 'semantic-ui-react';
import { transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';
import { Buffer } from 'buffer';

// Buffer needs to be installed via npm install --save buffer

function Transfer() {
    const [state, updateState] = useState({
        address: '',
        amount: '',
        accountInitializationFee: '',
        fee: '',
        privateKey: '',
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
        const privateKey = state.privateKey;
        const signedTx = await client.transaction.create({
            module: 'token',
            command: 'transfer',
            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            params: {
                tokenID: Buffer.from('0000000000000000', 'hex'),
                amount: BigInt(transactions.convertLSKToBeddows(state.amount)),
                recipientAddress: address,
                accountInitializationFee: BigInt(transactions.convertLSKToBeddows(state.accountInitializationFee)),
                data: 'Hey! I am sending you LSKs. Enjoy!'
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
            privateKey: '',
        });
    };


    const displayData = () => {
        if (typeof state.transaction !== 'undefined' && state.transaction.fee > 0) {
            return (
                <>
                    <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                    <pre>Response: {JSON.stringify(state.response, null, 2)}</pre>
                </>
            )
        }
        else {
            return (<p></p>)
        }
    }

    return (
        <>
            <div>
                <FixedMenuLayout />
                <Container>
                    <h2>Send LSK tokens</h2>
                    <p>On this page you can send LSK tokens to any address within the Hello sidechain.</p>
                    <Divider></Divider>
                    <div class="ui two column doubling stackable grid container">
                        <div class="column">

                            <Form onSubmit={handleSubmit} class="ui form">
                                <Form.Field class="field">
                                    <label>Recipient's Lisk32 Address:</label>
                                    <input placeholder="Recipient's Lisk32 Address" id="address" name="address" onChange={handleChange} value={state.address} />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Amount:</label>
                                    <input placeholder='Amount (1 = 10^8 tokens)' id="amount" name="amount" onChange={handleChange} value={state.amount} />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Fee:</label>
                                    <input placeholder='Fee (1 = 10^8 tokens)' id="fee" name="fee" onChange={handleChange} value={state.fee} />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Sender's private key:</label>
                                    <input placeholder="Private key of sender's account" type="password" id="privateKey" name="privateKey" onChange={handleChange} value={state.privateKey} />
                                </Form.Field>
                                <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                            </Form>
                        </div>

                        <div className='column'>
                            <h3>Your transaction's details are:</h3>
                            <div class="ui raised segment" style={{ overflow: 'scroll' }}>
                                <>
                                    {displayData()}
                                </>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default Transfer;
import FixedMenuLayout from '../layout/header';
import React, { useState } from "react";
import { Form, Button, Divider, Container } from 'semantic-ui-react';
import { cryptography, transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';
import { Buffer } from 'buffer';

function Transfer() {
    const [state, updateState] = useState({
        address: '',
        amount: '',
        fee: '',
        passphrase: '',
        keyPath: '0',
        error: '',
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
        const passphrase = state.passphrase;
        const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, "m/44'/134'/" + state.keyPath + "'");
        let responseError = '';

        const signedTx = await client.transaction.create({
            module: 'token',
            command: 'transfer',
            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            params: {
                tokenID: Buffer.from('0000000100000000', 'hex'),
                amount: BigInt(transactions.convertLSKToBeddows(state.amount)),
                recipientAddress: state.address,
                data: 'Hey! I am sending you tokens. Enjoy!'
            }
        }, privateKey).catch(err => {
            responseError = err.message;
        });

        let txResponse = '';
        if (typeof signedTx !== "undefined") {
            txResponse = await client.transaction.send(signedTx).catch(result => {
                console.log(result)
                responseError = result.message;
            });
        }

        updateState({
            transaction: signedTx,
            response: txResponse,
            error: responseError,
            address: '',
            amount: '',
            fee: '',
            passphrase: '',
            keyPath: '',
        });
    };

    const displayData = () => {

        if (state.error !== '') {
            return (
                <>
                    <div class="ui red segment" style={{ overflow: 'auto' }}>
                        <h3>Something went wrong! :(</h3>
                        <pre><strong>Error:</strong> {JSON.stringify(state.error, null, 2)}</pre>
                    </div>
                </>
            )
        }

        else if (typeof state.transaction !== 'undefined' && state.transaction.fee > 0) {
            return (
                <>
                    <h3>Your transaction details are</h3>
                    <div class="ui green segment" style={{ overflow: 'auto' }}>
                        <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                        <pre>Response: {
                            JSON.stringify(state.response, null, 2)}</pre>
                    </div>
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
                    <h2>Send tokens</h2>
                    <p>On this page you can send tokens to any address within the Hello World blockchain.</p>
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
                                    <label>Sender's Passphrase:</label>
                                    <input placeholder='Passphrase of the hello_client' id="passphrase" name="passphrase" onChange={handleChange} value={state.passphrase} type="password" />
                                </Form.Field>
                                <Form.Field class="field">
                                    <div class="ui yellow segment">
                                        <i class="lightbulb outline icon"></i>The <strong>Sender's keyPath</strong> value can be from <strong>0-102</strong>. A default value has been pre-filled, which can be changed accordingly.
                                    </div>
                                    <label>Sender's keyPath:</label>
                                    <div class="ui labeled input">
                                        <div class="ui label">
                                            m/44'/134'/
                                        </div>
                                        <input placeholder='Enter any number from 0-102' id="keyPath" name="keyPath" onChange={handleChange} value={state.keyPath} type="text" />
                                        <div class="ui label">
                                            '
                                        </div>
                                    </div>
                                </Form.Field>
                                <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                            </Form>
                        </div>

                        <div className='column'>
                            <>
                                {displayData()}
                            </>
                        </div>
                    </div>
                </Container>
            </div >
        </>
    );
}

export default Transfer;
import FixedMenuLayout from '../layout/header';
import React, { useState, Fragment } from "react";
import { Form, Button, Container, Divider } from 'semantic-ui-react';
import { transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';

function SendHello() {
    const [state, updateState] = useState({
        hello: '',
        fee: '',
        privateKey: '',
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
        const privateKey = state.privateKey;
        let responseError = '';

        const tx = await client.transaction.create({
            module: 'hello',
            command: 'createHello',
            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            params: {
                "message": state.hello,
            },
        }, privateKey).catch(err => {
            responseError = err.message;
        })
        let txResponse = '';
        if (typeof tx !== "undefined") {
            txResponse = await client.transaction.send(tx).catch(result => {
                console.log(result)
                responseError = result.message;
            });
        }

        updateState({
            transaction: tx,
            response: txResponse,
            error: responseError,
            hello: '',
            fee: '',
            privateKey: '',
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
                    <h3>Your transaction's details are:</h3>
                    <div class="ui green segment" style={{ overflow: 'auto' }}>
                        <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                        <pre>Response: {
                            JSON.stringify(state.response, null, 2)}</pre>
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <FixedMenuLayout />
            <Container>
                <div>
                    <h2>Send Hello Message</h2>
                    <p>Please fill the following form to send a "Hello" message.</p>
                    <Divider></Divider>
                    <div class="ui two column doubling stackable grid container">
                        <div class="column">
                            <Form onSubmit={handleSubmit} class="ui form">
                                <Form.Field class="field">
                                    <label>Your message:</label>
                                    <input placeholder="Hello Message" id="hello" name="hello" onChange={handleChange} value={state.hello} />
                                </Form.Field >
                                <Form.Field class="field">
                                    <label>Fee:</label>
                                    <input placeholder='Fee (1 = 10^8 tokens)' type="text" id="fee" name="fee" onChange={handleChange} value={state.fee} />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Sender's private key:</label>
                                    <input placeholder="Private key of sender's account" type="password" id="privateKey" name="privateKey" onChange={handleChange} value={state.privateKey} />
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
                </div>
            </Container>
        </>
    );
}

export default SendHello;
import FixedMenuLayout from '../layout/header';
import { Form, Button, Container, Divider } from 'semantic-ui-react';
import React, { useState } from "react";
import { cryptography, transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';

function SendHello() {
    const [state, updateState] = useState({
        hello: '',
        fee: '',
        error: '',
        passphrase: '',
        keyPath: '0',
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
            hello: '',
            fee: '',
            passphrase: '',
            keyPath: '',
        });
    };

    const displayData = () => {
        if (state.error !== '') {
            return (
                <>
                    <div className="ui red segment" style={{ overflow: 'auto' }}>
                        <h3>Something went wrong! :(</h3>
                        <pre><strong>Error:</strong> {JSON.stringify(state.error, null, 2)}</pre>
                    </div>
                </>
            )
        }
        else if (typeof state.transaction !== 'undefined' && state.transaction.fee > 0) {
            return (
                <>
                    <h3>Your transaction details are:</h3>
                    <div className="ui green segment" style={{ overflow: 'auto' }}>
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
                    <p>Please fill out the following form to send a "Hello" message.</p>
                    <Divider></Divider>
                    <div className="ui two column doubling stackable grid container">
                        <div className="column">
                            <Form onSubmit={handleSubmit} className="ui form">
                                <Form.Field className="field">
                                    <label>Your message:</label>
                                    <input placeholder="Hello Message" id="hello" name="hello" onChange={handleChange} value={state.hello} />
                                </Form.Field >
                                <Form.Field className="field">
                                    <label>Fee:</label>
                                    <input placeholder='Fee (1 = 10^8 tokens)' type="text" id="fee" name="fee" onChange={handleChange} value={state.fee} />
                                </Form.Field>
                                <Form.Field className="field">
                                    <label>Sender's Passphrase:</label>
                                    <input placeholder='Passphrase of the hello_client' id="passphrase" name="passphrase" onChange={handleChange} value={state.passphrase} type="password" />
                                </Form.Field>
                                <Form.Field className="field">
                                    <div className="ui yellow segment">
                                        <i className="lightbulb outline icon"></i>The <strong>Sender's keyPath</strong> value can be from <strong>0-102</strong>. A default value has been pre-filled, which can be changed accordingly.
                                    </div>
                                    <label>Sender's keyPath:</label>
                                    <div className="ui labeled input">
                                        <div className="ui label">
                                            m/44'/134'/
                                        </div>
                                        <input placeholder='Enter any number from 0-102' id="keyPath" name="keyPath" onChange={handleChange} value={state.keyPath} type="text" />
                                        <div className="ui label">
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
                </div>
            </Container>
        </>
    );
}

export default SendHello;
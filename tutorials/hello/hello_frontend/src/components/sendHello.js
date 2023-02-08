import FixedMenuLayout from '../layout/header';
import React, { useState } from "react";
import { Form, Button, Container, Divider } from 'semantic-ui-react';
import { transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';

function SendHello() {
    const [state, updateState] = useState({
        hello: '',
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
        const privateKey = state.privateKey;
        const tx = await client.transaction.create({
            module: 'hello',
            command: 'createHello',
            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            params: {
                "message": state.hello,
            },
        }, privateKey);

        let res = '';
        try {
            res = await client.transaction.send(tx);
        } catch (error) {
            res = error;
        }
        updateState({
            transaction: tx,
            response: res,
            hello: '',
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
                            <h3>Your transaction's details are:</h3>
                            <div class="ui raised segment" style={{ overflow: 'scroll' }}>
                                <>
                                    {displayData()}
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default SendHello;
import FixedMenuLayout from '../layout/header';
import React, { useState } from "react";
import { Form, Button, Grid, Container, Divider } from 'semantic-ui-react';
import { cryptography, transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';

function SendHello() {
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
        const passphrase = state.passphrase;
        const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, "m/44'/134'/0'");
        const tx = await client.transaction.create({
            module: 'hello',
            command: 'createHello',
            fee: BigInt(transactions.convertLSKToBeddows(state.fee)),
            params: {
                "message": state.hello,
            },
        }, privateKey);
        console.log('Transaction object: ', tx);
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
            passphrase: '',
        });
    };

    return (
        <>
            <FixedMenuLayout />
            <Container>
                <div>
                    <h1>Send Hello Message</h1>
                    <Divider></Divider>
                    {/* <p>Send a Hello transaction.</p> */}
                    {/* <Grid style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 500 }}> */}
                    <div class="ui two column doubling stackable grid container">
                        <div class="column">
                            <h4>Please fill the following form to send a "Hello" message.</h4>
                            <Form onSubmit={handleSubmit} class="ui form">

                                <Form.Field class="field">
                                    <label>Your message:</label>
                                    <input placeholder="Hello Message" id="hello" name="hello" onChange={handleChange} value={state.hello} />
                                </Form.Field >
                                <Form.Field class="field">
                                    <label>Fee:</label>
                                    <input placeholder='Fee (1 = 10^8 tokens):' type="text" id="fee" name="fee" onChange={handleChange} value={state.fee} />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Passphrase:</label>
                                    <input placeholder='Passphrase of your hello_client' type="text" id="passphrase" name="passphrase" onChange={handleChange} value={state.passphrase} />
                                </Form.Field>
                                <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                            </Form>
                        </div>
                        <div className='column'>

                            {/* { if (state.transaction.length > 0) {
    return (<>
                                <h4>Your account details are:</h4>
                                <div class="ui raised segment" style={{ overflow: 'scroll' }}>
                                    <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                                    <pre>Response: {JSON.stringify(state.response, null, 2)}</pre>
                                </div>
                            </>
                            );}
} */}
                            {/* 
                            <h4>Your account details are:</h4>
                            <div class="ui raised segment" style={{ overflow: 'scroll' }}>
                                <pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
                                <pre>Response: {JSON.stringify(state.response, null, 2)}</pre>
                            </div> */}
                        </div>
                    </div>
                    {/* </Grid.Column>
                </Grid> */}
                </div>
            </Container>
        </>
    );
}


//style={{ backgroundColor: '#0C152E', color: 'white' }}
export default SendHello;
import FixedMenuLayout from '../layout/header';
import { Form, Button, Divider, Container } from 'semantic-ui-react';
import React, { useState } from "react";
import { cryptography, transactions } from '@liskhq/lisk-client/browser';
import * as api from '../api';
import { Buffer } from 'buffer';

function Faucet() {
    const [state, updateState] = useState({
        address: '',
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
        const passphrase = "weather ordinary pistol basic afford result crater bring issue food wedding angle north humble know build shaft virus version walnut correct fish flock finger";
        const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, "m/44'/134'/0'");
        let responseError = '';

        const signedTx = await client.transaction.create({
            module: 'token',
            command: 'transfer',
            fee: BigInt(transactions.convertLSKToBeddows('0.1')),
            params: {
                tokenID: Buffer.from('0000000100000000', 'hex'),
                amount: BigInt(transactions.convertLSKToBeddows('10')),
                recipientAddress: state.address,
                data: 'Please accept this grant from Lisk faucet.'
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
        else {
            return (<p></p>)
        }
    }

    return (
        <>
            <FixedMenuLayout />
            <Container>
                <h2>Faucet</h2>
                <p>The faucet transfers tokens from the genesis account to another account.</p>
                <Divider></Divider>
                <div>
                    <div className="ui two column doubling stackable grid container">
                        <div className="column">
                            <Form onSubmit={handleSubmit}>
                                <Form.Field>
                                    <label>Recipient's Lisk32 Address:</label>
                                    <input placeholder="Recipient's Lisk32 Address" id="address" name="address" onChange={handleChange} value={state.address} />
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

export default Faucet;
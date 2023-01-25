import FixedMenuLayout from '../layout/header';
import FixedFooter from '../layout/footer';
import React, { useState } from 'react';
import { Form, Button, Container, Grid, Segment } from 'semantic-ui-react';
// `transactions` and `cryptography` from the `lisk-client` package are used to convert the data of the transaction into the correct format.
// import { cryptography, transactions } from '@liskhq/lisk-client';
// Inside `Faucet.js`, import the previously defined API client from `api.js`.
import * as api from './../api.js';

function Faucet() {

    // const [state, updateState] = useState({
    //     address: '',
    //     amount: '',
    //     transaction: {},
    //     response: {}
    // });

    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     updateState({
    //         ...state,
    //         [name]: value,
    //     });
    // };

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     const client = await api.getClient();
    //     const address = cryptography.getAddressFromBase32Address(state.address);
    //     // The API client is used to create the transaction object based on the inputs in the form below.
    //     const tx = await client.transaction.create({
    //         moduleID: 2,
    //         assetID: 0,
    //         fee: BigInt(transactions.convertLSKToBeddows('0.01')),
    //         asset: {
    //             amount: BigInt(transactions.convertLSKToBeddows(state.amount)),
    //             recipientAddress: address,
    //             data: '',
    //         },
    //     }, JSON.parse(JSON.stringify(accounts[10]["passphrase"]))); // Address of a delegate account
    //     // After creation, the transaction is submitted to the blockchain application.
    //     const response = await client.transaction.send(tx);
    //     // After submitting the transaction and receiving the response, the state of the Faucet component is updated with the transaction object and the API response.
    //     updateState({
    //         transaction: client.transaction.toJSON(tx),
    //         address: '',
    //         amount: '',
    //         response: response
    //     });
    //  }

    return (
        <div className="App">
            <FixedMenuLayout />
            <h1>Faucet</h1>
            <h4>The faucet transfers tokens from the genesis account to another.</h4>
            <Grid textAlign='center' style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 500 }}>
                    <Form>
                        {/* <Segment stacked> */}
                        <Form.Field>
                            <input placeholder='Lisk32 Address' />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Amount (1 = 10^8 tokens):' />
                        </Form.Field>
                        <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                        {/* </Segment> */}
                    </Form>
                </Grid.Column>
            </Grid>
            {/* <FixedFooter /> */}
        </div>

    );
}

export default Faucet;
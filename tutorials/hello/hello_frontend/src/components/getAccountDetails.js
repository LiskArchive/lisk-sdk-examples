import FixedMenuLayout from '../layout/header';
import { Form, Button, Grid, Container, Divider } from 'semantic-ui-react';
import React, { useState } from "react";
// import { cryptography } from '@liskhq/lisk-client/browser';
import * as api from '../api';

function GetAccountDetails() {

    const [state, updateState] = useState({
        address: '',
        account: {},
        auth: {},
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
        // Retrieves the account details from the blockchain application, based on the address provided.
        const account = await client.invoke("token_getBalance", {
            address: state.address,
            tokenID: "0000000000000000"
        })
        const authenticationDetails = await client.invoke("auth_getAuthAccount", {
            address: state.address,
            tokenID: "0000000000000000"
        })

        updateState({
            ...state,
            account: account,
            auth: authenticationDetails
        });
    };
    return (
        <div>
            <FixedMenuLayout />
            <Container>
                <h2>Account Details</h2>
                <Divider></Divider>
                <div class="ui two column doubling stackable grid container">

                    {/* <Grid style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'> */}
                    {/* <Grid.Column style={{ maxWidth: 500 }}> */}
                    <div class="column">

                        <h3>Get account details by submitting a Lisk32 address.</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                                <input placeholder="Lisk32 Address" id="address" name="address" onChange={handleChange} value={state.address} />
                            </Form.Field>
                            <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                        </Form>
                    </div>

                    {/* </Grid.Column>

                    </Grid> */}
                    <div className='column'>
                        <h3>Your account details are:</h3>
                        <div class="ui raised segment" style={{ overflow: 'scroll' }}>
                            <pre>Account: {JSON.stringify(state.account, null, 2)}</pre>
                            <pre>Authentication details: {JSON.stringify(state.auth, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </Container >
        </div >
    );
}

export default GetAccountDetails;
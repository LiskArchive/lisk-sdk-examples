import FixedMenuLayout from '../layout/header';
import { Form, Button, Grid, Container, Divider } from 'semantic-ui-react';
import React, { useState } from "react";
// import { cryptography } from '@liskhq/lisk-client/browser';
import * as api from '../api';

function GetAccountDetails() {

    const [state, updateState] = useState({
        address: 'lsko5v2u2wjswjogxgxdr79c45kewprypouyaky76',
        account: {},
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
        const account = await client.account.get(state.address);
        updateState({
            ...state,
            account: client.account.toJSON(account),
        });
    };



    return (
        <div>
            <FixedMenuLayout />
            <Container>
                <div>
                    <h2>Account Details</h2>
                    <p>Get account details by submitting a Lisk32 address.</p>
                    <Grid style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 500 }}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Field>
                                    <input placeholder="Lisk32 Address" id="address" name="address" onChange={handleChange} value={state.address} />
                                </Form.Field>
                                <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                            </Form>
                            <div>
                                <pre>Account: {JSON.stringify(state.account, null, 2)}</pre>
                            </div>
                        </Grid.Column>
                    </Grid>
                </div>
            </Container>
        </div>
    );
}

export default GetAccountDetails;
import FixedMenuLayout from '../layout/header';
import { Form, Button, Container, Divider } from 'semantic-ui-react';
import React, { useState } from "react";
import * as api from '../api';

function GetAccountDetails() {

    const [state, updateState] = useState({
        address: '',
        error: '',
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
        let responseError = '';
        let authenticationDetails;
        let balance;

        // Retrieves the account details from the blockchain application, based on the address provided.

        await client.invoke("token_getBalance", {
            address: state.address,
            tokenID: "0000000000000000"
        }).then(async response => {
            if (typeof response.error !== 'undefined') {
                responseError = response.error.message
            } else {
                balance = response;
                const authDetails = await client.invoke("auth_getAuthAccount", {
                    address: state.address,
                    tokenID: "0000000000000000"
                });
                authenticationDetails = authDetails;
            }
            return [response, authenticationDetails];
        })

        updateState({
            ...state,
            error: responseError,
            account: balance,
            auth: authenticationDetails
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
        else if (typeof state.account !== 'undefined' && state.account.availableBalance > 0) {
            return (
                <>
                    <h3>Your account details are:</h3>
                    <div className="ui green segment" style={{ overflow: 'auto' }}>
                        <pre>Account: {JSON.stringify(state.account, null, 2)}</pre>
                        <pre>Authentication details: {JSON.stringify(state.auth, null, 2)}</pre>
                    </div>
                </>
            )
        }
        else {
            return (<p></p>)
        }
    }

    return (
        <div>
            <FixedMenuLayout />
            <Container>
                <h2>Account details</h2>
                <p>Get account details by submitting a Lisk32 address.</p>
                <Divider></Divider>
                <div className="ui two column doubling stackable grid container">
                    <div className="column">

                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                                <label>Lisk32 address:</label>
                                <input placeholder="Lisk32 address" id="address" name="address" onChange={handleChange} value={state.address} />
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
            </Container >
        </div >
    );
}

export default GetAccountDetails;
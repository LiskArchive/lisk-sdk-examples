import FixedMenuLayout from '../layout/header';
import { Form, Button, Container, Divider } from 'semantic-ui-react';
import React, { useState } from "react";
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

    const displayData = () => {
        if (typeof state.account !== 'undefined' && state.account.availableBalance > 0) {
            return (
                <>
                    <pre>Account: {JSON.stringify(state.account, null, 2)}</pre>
                    <pre>Authentication details: {JSON.stringify(state.auth, null, 2)}</pre>
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
                <div class="ui two column doubling stackable grid container">
                    <div class="column">

                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                                <label>Lisk32 address:</label>
                                <input placeholder="Lisk32 address" id="address" name="address" onChange={handleChange} value={state.address} />
                            </Form.Field>
                            <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                        </Form>
                    </div>

                    <div className='column'>
                        <h3>Your account details are:</h3>
                        <div class="ui raised segment" style={{ overflow: 'scroll' }}>
                            <>
                                {displayData()}
                            </>
                        </div>
                    </div>
                </div>
            </Container >
        </div >
    );
}

export default GetAccountDetails;
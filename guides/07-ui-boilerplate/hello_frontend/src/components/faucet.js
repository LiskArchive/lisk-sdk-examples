import FixedMenuLayout from '../layout/header';
import React from 'react';
import { Form, Button, Grid } from 'semantic-ui-react';

function Faucet() {
    return (
        <div className="App">
            <FixedMenuLayout />
            <h1>Faucet</h1>
            <h4>The faucet transfers tokens from the genesis account to another.</h4>
            <Grid textAlign='center' style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 500 }}>
                    <Form>
                        <Form.Field>
                            <input placeholder='Lisk32 Address' />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Amount (1 = 10^8 tokens):' />
                        </Form.Field>
                        <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default Faucet;
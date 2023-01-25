import FixedMenuLayout from '../layout/header';
// import FixedFooter from '../layout/footer';
import { Form, Button, Grid } from 'semantic-ui-react';

function Transfer() {
    return (
        <div className="App">
            <FixedMenuLayout />
            <h1>Send LSK tokens</h1>
            <p>On this page you can send LSK tokens to any address within the Hello sidechain</p>
            <Grid textAlign='center' style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 500 }}>
                    <Form>
                        <Form.Field>
                            <input placeholder="Recipient's Lisk32 Address" />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Amount (1 = 10^8 tokens):' />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Fee' />
                        </Form.Field>
                        <Form.Field>
                            <input placeholder='Passphrase' />
                        </Form.Field>
                        <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                    </Form>
                </Grid.Column>
            </Grid>
            {/* <FixedFooter /> */}
        </div >

    );
}

export default Transfer;
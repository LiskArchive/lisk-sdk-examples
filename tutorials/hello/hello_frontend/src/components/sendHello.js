import FixedMenuLayout from '../layout/header';
import FixedFooter from '../layout/footer';
import { Form, Button, Grid } from 'semantic-ui-react';

function SendHello() {
    return (
        <div className="App">
            <FixedMenuLayout />
            <div>
                <h1>Send Hello Message</h1>
                <p>Send a Hello transaction.</p>
                <Grid textAlign='center' style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 500 }}>
                        <Form>
                            <Form.Field>
                                <input placeholder="Hello Message" />
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
            </div>
            <FixedFooter />
        </div>
    );
}

export default SendHello;
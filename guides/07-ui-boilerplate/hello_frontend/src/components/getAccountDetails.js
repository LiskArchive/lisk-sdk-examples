import FixedMenuLayout from '../layout/header';
import FixedFooter from '../layout/footer';
import { Form, Button, Grid } from 'semantic-ui-react';

function GetAccountDetails() {
    return (
        <div className="App">
            <FixedMenuLayout />
            <div>
                <h2>Account Details</h2>
                <p>Get account details by submitting the Lisk32 address</p>
                <Grid textAlign='center' style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 500 }}>
                        <Form>
                            <Form.Field>
                                <input placeholder="Lisk32 Address" />
                            </Form.Field>
                            <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
                {/* <pre>{JSON.stringify(credentials, null, 2)}</pre> */}
            </div>
        </div>
    );
}

export default GetAccountDetails;
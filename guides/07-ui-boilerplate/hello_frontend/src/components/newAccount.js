import FixedMenuLayout from '../layout/header';
import { Form, Button, Grid } from 'semantic-ui-react';

function NewAccount() {
    return (
        <div className="App">
            <FixedMenuLayout />
            <div>
                <h2>Create new account</h2>
                <p>To create a new account, click on the following button:</p>
                <Grid textAlign='center' style={{ height: 'max', overflow: 'hidden' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 500 }}>
                        <Form>
                            <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Click Me</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        </div>
    );
}

export default NewAccount;
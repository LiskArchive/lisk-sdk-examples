import { Form, Button, Grid } from 'semantic-ui-react';
import { passphrase, cryptography } from 'lisk-elements';
import FixedMenuLayout from '../layout/header';

const newCredentials = () => {
    const pass = passphrase.Mnemonic.generateMnemonic();
    const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(pass);
    const credentials = {
        address: cryptography.getBase32AddressFromPassphrase(pass),
        binaryAddress: cryptography.getAddressFromPassphrase(pass).toString("hex"),
        passphrase: pass,
        publicKey: keys.publicKey.toString("hex"),
        privateKey: keys.privateKey.toString("hex")
    };
    return credentials;
};


function NewAccount() {
    const credentials = newCredentials();
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
                <pre>{JSON.stringify(credentials, null, 2)}</pre>
            </div>
        </div>
    );
}

export default NewAccount;
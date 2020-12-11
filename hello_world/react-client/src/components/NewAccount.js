import React, { Component } from 'react';
import * as passphrase from '@liskhq/lisk-passphrase';
import * as cryptography from '@liskhq/lisk-cryptography';

const newCredentials = () => {
    const pass = passphrase.Mnemonic.generateMnemonic();
    const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(pass);
    const credentials = {
        address: cryptography.getAddressFromPassphrase(pass).toString("hex"),
        passphrase: pass,
        publicKey: keys.publicKey.toString("hex"),
        privateKey: keys.privateKey.toString("hex")
    };
    return credentials;
};

class NewAccount extends Component {

    constructor(props) {
        super(props);

        this.state = { credentials: newCredentials() };
    }

    render() {
        return (
            <div>
                <h2>Create new account</h2>
                <p>Refresh page to get new credentials.</p>
                <pre>{JSON.stringify(this.state.credentials, null, 2)}</pre>
            </div>
        );
    }
}
export default NewAccount;

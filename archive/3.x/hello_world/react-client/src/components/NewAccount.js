import React, { Component } from 'react';
import * as cryptography from '@liskhq/lisk-cryptography';
import { Mnemonic } from '@liskhq/lisk-passphrase';

const newCredentials = () => {
    const passphrase = Mnemonic.generateMnemonic();
    const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(
        passphrase
    );
    const credentials = {
        address: cryptography.getAddressFromPublicKey(keys.publicKey),
        passphrase: passphrase,
        publicKey: keys.publicKey,
        privateKey: keys.privateKey
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

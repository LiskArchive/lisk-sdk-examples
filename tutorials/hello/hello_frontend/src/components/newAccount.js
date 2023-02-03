import { Container, Divider } from 'semantic-ui-react';
import FixedMenuLayout from '../layout/header';
import { passphrase, cryptography } from '@liskhq/lisk-client/browser';
import React, { useState, useEffect } from "react";



function NewAccount() {
    const [accounts, createNewAccount] = useState('');

    useEffect(() => {
        createAccount()
    }, [])

    const createAccount = async () => {
        const accountKeyPath = "m/44'/134'/0'";
        const mnemonicPassphrase = passphrase.Mnemonic.generateMnemonic(256);
        const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(
            mnemonicPassphrase,
            accountKeyPath,
        );
        const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey);
        const address = cryptography.address.getLisk32AddressFromPublicKey(publicKey);
        const credentials = {
            address,
            passphrase: mnemonicPassphrase,
            privateKey: privateKey.toString('hex'),
            publicKey: publicKey.toString('hex'),
        };
        createNewAccount(credentials);
        return credentials;
    };

    return (
        <div>
            <FixedMenuLayout />
            <Container>

                <div>

                    <div class="ui green segment">
                        <i class="lightbulb outline icon"></i><strong>TIP:</strong> Reload the page to generate a new account.

                    </div>

                    <h2>New account created!</h2>
                    <Divider></Divider>
                    <div className='App'>
                        <pre>{JSON.stringify(accounts, null, 2)}</pre>
                    </div>
                </div>

            </Container>
        </div>
    );
}

export default NewAccount;
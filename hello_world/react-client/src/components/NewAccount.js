import React, { Component } from 'react';
import ReactDOM from "react-dom";
const cryptography = require('@liskhq/lisk-cryptography');
const { Mnemonic } = require('@liskhq/lisk-passphrase');

const getPacketCredentials = () => {
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

        this.state = { credentials: getPacketCredentials() };
    }

/*    async componentDidMount() {
        const response = await fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=10`);
        const json = await response.json();
        this.setState({ data: json });
    }*/

    render() {
        return (
            <div>
                <h2>Create new account</h2>
                <div>{this.state.credentials}</div>
            </div>
        );
    }
}
export default NewAccount; // Don’t forget to use export default!

//ReactDOM.render(<NewAccount />, document.getElementById("NewAccount"));

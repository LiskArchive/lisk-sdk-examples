import React from "react";
import { passphrase, cryptography } from '@liskhq/lisk-client';

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

const NewAccount = () => {
  const credentials = newCredentials();
  return (
    <div>
      <h2>Create new account</h2>
      <p>Refresh page to get new credentials.</p>
      <pre>{JSON.stringify(credentials, null, 2)}</pre>
    </div>
  );
}
export default NewAccount;

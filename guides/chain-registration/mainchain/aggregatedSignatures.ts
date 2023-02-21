const { writeFileSync, fs } = require('fs-extra');
const { codec, cryptography } = require('@liskhq/lisk-client');
const { keys:blsKeys } = require('keys.json');
const { registrationSignatureMessageSchema } = require('./schemas');
const { MESSAGE_TAG_CHAIN_REG } = require('./constants');

(async () => {
    const { bls } = cryptography;
    let params;
    fs.readFile('params.json', (err, data) => {
        if (!err && data) {
            console.log("params:");
            console.log(data);
            params = data.params;
        } else {
            console.log("params.json missing.");
            process.exit(1);
        }
    });

    const message = codec.codec.encode(registrationSignatureMessageSchema, params);

    let sidechainValidatorsSignatures: { publicKey: Buffer; signature: Buffer; }[];

    fs.readFile('sidechainValidatorsSignatures.json', (err, data) => {
        if (!err && data) {
            console.log("data");
            console.log(data);
            sidechainValidatorsSignatures = data;
        } else {
            console.log("first");

            // Create first signature for the Registration CCM
            sidechainValidatorsSignatures = [];
        }

        const signature = bls.signData(
          MESSAGE_TAG_CHAIN_REG,
          params.ownChainID,
          message,
          blsKeys[0].plain.blsPrivateKey,
        );
        sidechainValidatorsSignatures.push({ publicKey: blsKeys[0].plain.blsKey, signature });

        writeFileSync('./sidechainValidatorsSignatures.json',  JSON.stringify(sidechainValidatorsSignatures));
    });

    process.exit(0);
})();
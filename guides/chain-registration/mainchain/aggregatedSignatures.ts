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

    // Create message by encoding params
    const message = codec.codec.encode(registrationSignatureMessageSchema, params);

    let sidechainValidatorsSignatures: { publicKey: Buffer; signature: Buffer; }[];

    // Read the existing list of validator signatures, or create a new one if none exists, yet.
    fs.readFile('sidechainValidatorsSignatures.json', (err, data) => {
        if (!err && data) {
            sidechainValidatorsSignatures = data;
            console.log("sidechain validators signatures list:");
            console.log(sidechainValidatorsSignatures);
        } else {
            console.log("First signature!");
            console.log("Creating a fresh sidechainValidatorsSignatures.json ...");

            sidechainValidatorsSignatures = [];
        }

        // Create signature for the current validator
        const signature = bls.signData(
          MESSAGE_TAG_CHAIN_REG,
          params.ownChainID,
          message,
          blsKeys[0].plain.blsPrivateKey,
        );
        // Add signature to the list of validator signatures
        sidechainValidatorsSignatures.push({ publicKey: blsKeys[0].plain.blsKey, signature });

        // Save the list of validator signatures
        writeFileSync('./sidechainValidatorsSignatures.json',  JSON.stringify(sidechainValidatorsSignatures));
    });

    process.exit(0);
})();
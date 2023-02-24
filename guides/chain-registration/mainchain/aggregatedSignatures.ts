//const { writeFileSync, readFile } = require('fs-extra');
const fs = require('fs');
const { codec, cryptography } = require('@liskhq/lisk-client');
const { keys:blsKeys } = require('./keys.json');
const paramsJSON = require('./params.json');
const { registrationSignatureMessageSchema } = require('./schemas.ts');
const { MESSAGE_TAG_CHAIN_REG } = require('./constants.ts');

(async () => {
    const { bls } = cryptography;
    let params;
    console.log("params:");
    //console.log(paramsJSON);
    params = {
        ownChainID: Buffer.from(paramsJSON.ownChainID, 'hex'),
        ownName: paramsJSON.ownName,
        mainchainValidators: paramsJSON.mainchainValidators.map(v => ({
            blsKey: Buffer.from(v.blsKey, 'hex'),
            bftWeight: BigInt(v.bftWeight),
        })),
        mainchainCertificateThreshold: paramsJSON.mainchainCertificateThreshold.toString(),
    };

    // Create message by encoding params
    const message = codec.codec.encode(registrationSignatureMessageSchema, params);

    let sidechainValidatorsSignatures = [];

    // Read the existing list of validator signatures, or create a new one if none exists, yet.
    fs.readFile('./sidechainValidatorsSignatures.json', (err, data) => {
        if (!err && data) {
            sidechainValidatorsSignatures = data;
            console.log("sidechain validators signatures list:");
            console.log(sidechainValidatorsSignatures);
        } else {
            console.log("First signature!");
            console.log("Creating a fresh sidechainValidatorsSignatures.json ...");

            sidechainValidatorsSignatures = [];
        }

        console.log("pieps");
        // Create signature for the current validator
        const signature = bls.signData(
          MESSAGE_TAG_CHAIN_REG,
          params.ownChainID,
          message,
          blsKeys[0].plain.blsPrivateKey,
        );
        // Add signature to the list of validator signatures
        sidechainValidatorsSignatures.push({ publicKey: blsKeys[0].plain.blsKey, signature });

        console.log("sidechainValidatorsSignatures");
        console.log(sidechainValidatorsSignatures);
        // Save the list of validator signatures
        fs.writeFileSync('./sidechainValidatorsSignatures.json',  JSON.stringify(sidechainValidatorsSignatures));
        console.log("end");
        process.exit(0);
    });
})();
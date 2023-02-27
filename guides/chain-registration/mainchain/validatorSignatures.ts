const fse = require('fs-extra');
//const fs = require('fs');
const codec = require('@liskhq/lisk-codec');
const cryptography = require('@liskhq/lisk-cryptography');
const { keys:blsKeys } = require('./keys.json');
const paramsJSON = require('./params.json');
const { registrationSignatureMessageSchema } = require('./schemas.ts');
const { MESSAGE_TAG_CHAIN_REG } = require('./constants.ts');

(async () => {
    const { bls } = cryptography;
    let params;
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

    let sidechainValidatorsSignatures;

    // Read the existing list of validator signatures, or create a new one if none exists, yet.
    fse.readJSON('./sidechainValidatorsSignatures.json', (err, data) => {
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
          Buffer.from(blsKeys[0].plain.blsPrivateKey,"hex"),
        );
        // Add signature to the list of validator signatures
        sidechainValidatorsSignatures.push({ publicKey: blsKeys[0].plain.blsKey, signature });

        // Sort validators from sidechain
        sidechainValidatorsSignatures.sort((a, b) => {
            a.publicKey.localeCompare(b.publicKey);
        });

        console.log("sidechainValidatorsSignatures");
        console.log(sidechainValidatorsSignatures);
        // Save the list of validator signatures
        fse.writeFileSync('./sidechainValidatorsSignatures.json',  JSON.stringify(sidechainValidatorsSignatures));
        console.log("end");
        process.exit(0);
    });
})();
//const apiClient =  require('@liskhq/lisk-api-client');
const fse = require('fs-extra');
//const fs = require('fs');
const codec = require('@liskhq/lisk-codec');
const cryptography = require('@liskhq/lisk-cryptography');
const { keys:blsKeys } = require('./keys.json');
const paramsJSON = require('./params.json');
const { registrationSignatureMessageSchema } = require('./schemas.ts');
const { MESSAGE_TAG_CHAIN_REG } = require('./constants.ts');
//const { keys: sidechainValidatorsKeys } =  require('./dev-validators.json');


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

/*        // ***********
        //Code for automatically signing with devnet validators
        const sidechainClient = await apiClient.createIPCClient('~/.lisk/hello_client');
        const sidechainNodeInfo = await sidechainClient.invoke('system_getNodeInfo');
        // Get active validators from sidechainchain
        const { validators: sidehcainActiveValidators } = await sidechainClient.invoke('consensus_getBFTParameters', { height: sidechainNodeInfo.height });

        let activeValidatorsWithPrivateKey = [];
        for (const v of sidehcainActiveValidators) {
            const validatorInfo = sidechainValidatorsKeys.find(configValidator => configValidator.plain.blsKey === v.blsKey);
            if (validatorInfo) {
                activeValidatorsWithPrivateKey.push({
                    blsPublicKey: Buffer.from(v.blsKey, 'hex'),
                    blsPrivateKey: Buffer.from(validatorInfo.plain.blsPrivateKey, 'hex'),
                });
            }
        }
        // Sort active validators from sidechainchain
        activeValidatorsWithPrivateKey.sort((a, b) => a.blsPublicKey.compare(b.blsPublicKey));

        for (const validator of activeValidatorsWithPrivateKey) {
            const signature = bls.signData(
              MESSAGE_TAG_CHAIN_REG,
              params.ownChainID,
              message,
              validator.blsPrivateKey,
            );
            sidechainValidatorsSignatures.push({ publicKey: validator.blsPublicKey, signature });
        }
        // ************/

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
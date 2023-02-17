const { writeFileSync, fs } = require('fs-extra');
const { codec, cryptography, apiClient } = require('@liskhq/lisk-client');
const { keys:blsKeys } = require('keys.json');
import { NodeInfo, BFTParametersJSON } from './extern_types';
import { registrationSignatureMessageSchema } from './schemas';
import { MESSAGE_TAG_CHAIN_REG } from './constants';

(async () => {
    const { bls } = cryptography;
    const mainchainClient = await apiClient.createIPCClient('~/.lisk/pos-mainchain');
    //const sidechainClient = await apiClient.createIPCClient('~/.lisk/apple');
    const mainchainNodeInfo = await mainchainClient.invoke('system_getNodeInfo');
    // Get active validators from mainchain
    const { validators: mainchainActiveValidators, certificateThreshold: mainchainCertificateThreshold } = await mainchainClient.invoke('consensus_getBFTParameters', { height: mainchainNodeInfo.height });

    const paramsJSON = {
        ownChainID: '03000008',
        ownName: 'sidechain_8',
        mainchainValidators: mainchainActiveValidators.map(v => ({ blsKey: v.blsKey, bftWeight: v.bftWeight })).sort((a, b) => Buffer.from(a.blsKey, 'hex').compare(Buffer.from(b.blsKey, 'hex'))),
        mainchainCertificateThreshold,
    };

    const params = {
        ownChainID: Buffer.from(paramsJSON.ownChainID, 'hex'),
        ownName: paramsJSON.ownName,
        mainchainValidators: paramsJSON.mainchainValidators.map(v => ({
            blsKey: Buffer.from(v.blsKey, 'hex'),
            bftWeight: BigInt(v.bftWeight),
        })),
        mainchainCertificateThreshold: paramsJSON.mainchainCertificateThreshold.toString(),
    };

    const message = codec.encode(registrationSignatureMessageSchema, params);

    fs.readFile('registerMainchain.json', (err, data) => {
        if (!err && data) {
            console.log("data");
            console.log(data);
        } else {
            console.log("first");

            // Create first signature for the Registration CCM
            const sidechainValidatorsSignatures: { publicKey: Buffer; signature: Buffer; }[] = [];
            const signature = bls.signData(
              MESSAGE_TAG_CHAIN_REG,
              params.ownChainID,
              message,
              blsKeys[0].plain.blsPrivateKey,
            );
            sidechainValidatorsSignatures.push({ publicKey: blsKeys[0].plain.blsKey, signature });

            // Create BLS public keys list
            const publicKeysList = blsKeys[0].map(v => v.plain.blsPublicKey);

            // Create an aggregated signature & aggregation bits
            const { aggregationBits, signature:sig } = bls.createAggSig(
              publicKeysList,
              sidechainValidatorsSignatures,
            );

            console.log('Result after creating aggregate signature:\n"aggregationBits": ', aggregationBits.toString('hex'), '\n"signature":', signature.toString('hex'));

            writeFileSync('./mainchain_reg_params.json',  JSON.stringify({ ...paramsJSON, signature: signature.toString('hex'), aggregationBits: aggregationBits.toString('hex')}));

        }
    });
   // const sidechainNodeInfo = await sidechainClient.invoke('system_getNodeInfo');
    // Get active validators from sidechainchain
    //const { validators: sidehcainActiveValidators } = await sidechainClient.invoke('consensus_getBFTParameters', { height: sidechainNodeInfo.height });

    /*for (const v of sidehcainActiveValidators) {
        const validatorInfo = sidechainValidatorsKeys.find(configValidator => configValidator.plain.blsKey === v.blsKey);
        if (validatorInfo) {
     */

     //   }
   // }
    // Sort active validators from sidechainchain
    //activeValidatorsWithPrivateKey.sort((a, b) => a.blsPublicKey.compare(b.blsPublicKey));

    //const keys: Buffer[] = [];
    //const weights: bigint[] = [];
    // Sign with each active validator
    //for (const validator of activeValidatorsWithPrivateKey) {
        //keys.push(validator.blsPublicKey);
        //weights.push(BigInt(1));

    //}


    
    /*const verifyResult = bls.verifyWeightedAggSig(
        keys,
        aggregationBits,
        signature,
        MESSAGE_TAG_CHAIN_REG,
        params.ownChainID,
        message,
        weights,
        BigInt(68),
    )
    console.log('==SIGNATURE VERIFICATION RESULT====', verifyResult);*/
    

    console.log('Mainchain registration file is created at ./config/default/chain_registration/mainchain_reg_params.json successfully.');
    
    console.log(`Run below command to create transaction:\n "./bin/run transaction:create interoperability registerMainchain 20000000 --pretty -f ./config/default/chain_registration/mainchain_reg_params.json"`);
    
    // Now run transaction:create command
    /**
     * 1. Run transaction:create commandn using the created params file
     * CMD: ./bin/run transaction:create interoperability registerMainchain 20000000 --pretty --passphrase="mango negative chat fence kingdom slot beyond venture expire pepper kitten amazing neutral amount genius census vacant inspire state zero essence gorilla turtle logic" -f ./config/default/mainchain_reg_params.json
     * 2. Send or DryRun the transaction
     * CMD: ./bin/run transaction:send <TX_HEX>
     * 3. Call `chain_getEvents(height)` RPC for the block height the above transaction was included.
     * 4. Call `chain_getBlockByHeight(height)` RPC to get the block in which the transaction was included.
     * 5. Call `interoperability_getChainAccount(chainID)` RPC to get the mainchain account which was registered above.
     */

    process.exit(0);
})();
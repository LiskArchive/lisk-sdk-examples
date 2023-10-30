const { apiClient, cryptography, codec, Transaction, multisigRegMsgSchema } = require('lisk-sdk');
const { ed, address } = cryptography;
const { accounts } = require('./accounts.json');
const { registerMultisignatureParamsSchema, } = require('lisk-framework/dist-node/modules/auth/schemas');
const RPC_ENDPOINT = 'ws://127.0.0.1:7887/rpc-ws';

(async () => {
    const appClient = await apiClient.createWSClient(RPC_ENDPOINT);
    const chainID = Buffer.from('00000001', 'hex');

    // The account which will be used to send the multiSignature account registration transaction.
    const senderKeyInfo = accounts[0];

    // const mandatoryAccount1 = accounts[0];
    // const mandatoryAccount2 = accounts[1];
    // const sortedMandatoryKeys = [Buffer.from(mandatoryAccount1.publicKey, 'hex'), Buffer.from(mandatoryAccount2.publicKey, 'hex')].sort((a, b) => a.compare(b));
    const sortedMandatoryKeys = []; // In case you want to use multiple 'Mandatory' accounts, comment this line and un-comment + edit the 3 lines above.

    // For this example, we are using three Optional accounts.
    const optionalAccount1 = accounts[0];
    const optionalAccount2 = accounts[1];
    const optionalAccount3 = accounts[2];

    const sortedOptionalKeys = [Buffer.from(optionalAccount1.publicKey, 'hex'), Buffer.from(optionalAccount2.publicKey, 'hex'), Buffer.from(optionalAccount3.publicKey, 'hex')].sort((a, b) => a.compare(b));

    const { nonce } = await appClient.invoke('auth_getAuthAccount', {
        address: address.getLisk32AddressFromPublicKey(Buffer.from(senderKeyInfo.publicKey, 'hex')),
    });

    const unSignedData = {
        address: address.getAddressFromLisk32Address(senderKeyInfo.address),
        nonce: BigInt(nonce),
        numberOfSignatures: 2,
        mandatoryKeys: sortedMandatoryKeys,
        optionalKeys: sortedOptionalKeys,
    };
    console.log('Unsigned data -------->', unSignedData);

    // Each multisig account registration data must be encoded with the multisigRegMsgSchema
    const msgBytes = codec.encode(multisigRegMsgSchema, unSignedData);

    var signatures = [];

    // for (const account of [mandatoryAccount1, mandatoryAccount2].sort((a, b) => Buffer.from(a.publicKey, 'hex').compare(Buffer.from(b.publicKey, 'hex')))) {
    //     signatures.push(ed.signDataWithPrivateKey(
    //         'LSK_RMSG_',
    //         chainID,
    //         msgBytes,
    //         Buffer.from(account.privateKey, 'hex'),
    //     ));
    // }

    // Use the encoded msgBytes to push signatures from each Optional account.
    for (const account of [optionalAccount1, optionalAccount2, optionalAccount3].sort((a, b) => Buffer.from(a.publicKey, 'hex').compare(Buffer.from(b.publicKey, 'hex')))) {
        signatures.push(ed.signDataWithPrivateKey(
            'LSK_RMSG_',
            chainID,
            msgBytes,
            Buffer.from(account.privateKey, 'hex'),
        ));
    }

    const transactionParams = {
        numberOfSignatures: 2,
        mandatoryKeys: sortedMandatoryKeys, // Empty array
        optionalKeys: sortedOptionalKeys,   // Contains public keys of all three optional accounts
        signatures,                         // Contains signatures from all three optional accounts
    };
    console.log('Transaction params in script-------->', transactionParams);

    const transactionObject = new Transaction({
        module: 'auth',
        command: 'registerMultisignature',
        fee: BigInt(200000000),
        params: codec.encode(registerMultisignatureParamsSchema, transactionParams),
        nonce: BigInt(nonce),
        senderPublicKey: Buffer.from(senderKeyInfo.publicKey, 'hex'),
        signatures: [],
    });

    transactionObject.sign(
        chainID,
        Buffer.from(senderKeyInfo.privateKey, 'hex'),
    );

    const dryRunResult = await appClient.invoke('txpool_dryRunTransaction', {
        transaction: transactionObject.getBytes().toString('hex'),
    });

    console.log(`Result from dry running the transaction is: `,
        dryRunResult,
    );

    const result = await appClient.invoke('txpool_postTransaction', {
        transaction: transactionObject.getBytes().toString('hex'),
    });

    console.log(`Result from transaction pool is: `,
        result,
    );

    process.exit(0);
})();
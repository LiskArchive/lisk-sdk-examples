const { apiClient, cryptography, codec } = require('lisk-sdk');
const { Transaction } = require('lisk-sdk')
const { ed, address } = cryptography;
const { accounts } = require('./accounts.json');
const { registerMultisignatureParamsSchema, multisigRegMsgSchema } = require('./schemas');
const RPC_ENDPOINT = 'ws://127.0.0.1:7887/rpc-ws';

(async () => {
    const appClient = await apiClient.createWSClient(RPC_ENDPOINT);
    const chainID = Buffer.from('12345678', 'hex');
    const senderAccount = accounts[0];
    const mandatoryAccount1 = accounts[0];
    const mandatoryAccount2 = accounts[1];
    // const optionalAccount1 = keys[2];
    // const optionalAccount2 = keys[3];
    const sortedMandatoryKeys = [Buffer.from(mandatoryAccount1.publicKey, 'hex'), Buffer.from(mandatoryAccount2.publicKey, 'hex')].sort((a, b) => a.compare(b));
    const sortedOptionalKeys = []
    // const sortedOptionalKeys = [Buffer.from(optionalAccount1.publicKey, 'hex'), Buffer.from(optionalAccount2.publicKey, 'hex')].sort((a, b) => a.compare(b));

    const senderKeyInfo = accounts[0];
    const { nonce } = await appClient.invoke('auth_getAuthAccount', {
        address: address.getLisk32AddressFromPublicKey(Buffer.from(senderKeyInfo.publicKey, 'hex')),
    });
    const signData = {
        address: address.getAddressFromLisk32Address(senderAccount.address),
        nonce: BigInt(nonce),
        numberOfSignatures: 2,
        mandatoryKeys: sortedMandatoryKeys,
        optionalKeys: sortedOptionalKeys,
    };
    console.log('sign data--------', signData);

    const msgBytes = codec.encode(multisigRegMsgSchema, signData);

    var signatures = [];

    for (const account of [mandatoryAccount1, mandatoryAccount2].sort((a, b) => Buffer.from(a.publicKey, 'hex').compare(Buffer.from(b.publicKey, 'hex')))) {
        signatures.push(ed.signDataWithPrivateKey(
            'LSK_RMSG_',
            chainID,
            msgBytes,
            Buffer.from(account.privateKey, 'hex'),
        ));
    }

    // for (const account of [optionalAccount1, optionalAccount2].sort((a, b) => Buffer.from(a.publicKey, 'hex').compare(Buffer.from(b.publicKey, 'hex')))) {
    //     signatures.push(ed.signDataWithPrivateKey(
    //         'LSK_RMSG_',
    //         chainID,
    //         msgBytes,
    //         Buffer.from(account.privateKey, 'hex'),
    //     ));
    // }

    const params = {
        numberOfSignatures: 2,
        mandatoryKeys: sortedMandatoryKeys,
        optionalKeys: sortedOptionalKeys,
        signatures,
    };
    console.log('Params in script-------->', params);

    const tx = new Transaction({
        module: 'auth',
        command: 'registerMultisignature',
        fee: BigInt(200000000),
        params: codec.encode(registerMultisignatureParamsSchema, params),
        nonce: BigInt(nonce),
        senderPublicKey: Buffer.from(senderKeyInfo.publicKey, 'hex'),
        signatures: [],
    });

    tx.sign(
        chainID,
        Buffer.from(senderKeyInfo.privateKey, 'hex'),
    );

    const dryRunResult = await appClient.invoke('txpool_dryRunTransaction', {
        transaction: tx.getBytes().toString('hex'),
    });

    console.log(`Result from dry running the transaction is: `,
        dryRunResult,
    );

    const result = await appClient.invoke('txpool_postTransaction', {
        transaction: tx.getBytes().toString('hex'),
    });

    console.log(`Result from transaction pool is: `,
        result,
    );


    process.exit(0);
})();
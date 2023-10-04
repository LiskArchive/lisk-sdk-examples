const { apiClient, cryptography, codec, transactions, validator, utils, chain, transa } = require('lisk-sdk');
const { Transaction, transactionSchema, TAG_TRANSACTION } = require('@liskhq/lisk-chain')
const { ed, address } = cryptography;
const { keys } = require('../accounts.json');
const { registerMultisignatureParamsSchema, multisigRegMsgSchema, transferParamsSchema } = require('../schemas');
const RPC_ENDPOINT = 'ws://127.0.0.1:7887/rpc-ws';

(async () => {
    const appClient = await apiClient.createWSClient(RPC_ENDPOINT);
    const chainID = Buffer.from('12345678', 'hex');
    const mandatoryAccount1 = keys[0];
    const mandatoryAccount2 = keys[1];

    const sortedMandatoryKeys = [Buffer.from(mandatoryAccount1.publicKey, 'hex'), Buffer.from(mandatoryAccount2.publicKey, 'hex')].sort((a, b) => a.compare(b));
    const sortedOptionalKeys = []
    const senderKeyInfo = keys[0];
    const latestNonce = BigInt(2);

    const signData = {
        address: address.getAddressFromLisk32Address(senderKeyInfo.address),
        nonce: latestNonce, //nonce should be higher than the existing nonce
        numberOfSignatures: 2,
        mandatoryKeys: sortedMandatoryKeys,
        optionalKeys: sortedOptionalKeys,
    };
    // console.log('sign data--------', signData);

    const msgBytes = codec.encode(multisigRegMsgSchema, signData);

    var signatures = [];

    for (const account of [mandatoryAccount1, mandatoryAccount2].sort((a, b) => Buffer.from(a.publicKey, 'hex').compare(Buffer.from(b.publicKey, 'hex')))) {
        signatures.push(ed.signDataWithPrivateKey(
            TAG_TRANSACTION,
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

    const signingParams = {
        numberOfSignatures: 2,
        mandatoryKeys: sortedMandatoryKeys,
        optionalKeys: sortedOptionalKeys,
        signatures,
    };

    const transferParams = {
        tokenID: Buffer.from('1234567800000000', 'hex'),
        recipientAddress: cryptography.address.getAddressFromLisk32Address(keys[1].address),
        amount: BigInt(1000),
        data: 'Hello!',
    };

    const encodedTransferParams = codec.encode(transferParamsSchema, transferParams);

    const unsignedTx = new Transaction({
        module: 'token',
        command: 'transfer',
        nonce: latestNonce,
        senderPublicKey: Buffer.from(senderKeyInfo.publicKey, 'hex'),
        fee: BigInt(100000000),
        params: encodedTransferParams,
        signatures: [],
    });

    // const signedTX = unsignedTx.sign(
    //     chainID,
    //     Buffer.from(senderKeyInfo.privateKey, 'hex'),
    // );

    // console.log(unsignedTx.getBytes().toString('hex'))

    const signMultiSig2 = transactions.signMultiSignatureTransactionWithPrivateKey(unsignedTx, chainID, Buffer.from(mandatoryAccount2.privateKey, 'hex'), signingParams);

    const signMultiSig1 = transactions.signMultiSignatureTransactionWithPrivateKey(signMultiSig2, chainID, Buffer.from(senderKeyInfo.privateKey, 'hex'), signingParams);
    const signedTX = signMultiSig1;

    // console.log(signedTX);
    // console.log(transactions.getBytes(signedTX).toString('hex'));

    const dryRunResult = await appClient.invoke('txpool_dryRunTransaction', {
        transaction: unsignedTx.getBytes().toString('hex'),
    });

    console.log(`Result from dry running the transaction is: `,
        dryRunResult,
    );

    process.exit(0);
})();








// const signedTx = transactions.signMultiSignatureTransactionWithPrivateKey(unsignedTx, chainID, Buffer.from(senderKeyInfo.privateKey, 'hex'), signingParams, transactionSchema.params);


// const signedTx = unsignedTx.sign(
//     unsignedTx,
//     chainID,
//     Buffer.from(senderKeyInfo.privateKey, 'hex'),
//     params.mandatoryKeys,
//     params.optionalKeys,
//     transactionSchema
// )



// const signedTx = (unsignedTx) => {
// const signedTx = transactions.signTransaction(
//     unsignedTx,
//     chainID,
//     Buffer.from(senderKeyInfo.privateKey, 'hex'),
//     transactionSchema.params
// );
// // }
// console.log(signedTx);

// const signedTxBytes = transactions.getBytes(signedTx, transactionSchema.params).toString('hex');

// console.log(signedTxBytes);
// const signedTx = unsignedTx.sign(chainID, Buffer.from(senderKeyInfo.privateKey, 'hex'));

// console.log('Signed Transfer transaction-------->', signedTx);

// const dryRunResult = await appClient.invoke('txpool_dryRunTransaction', {
//     transaction: signedTxBytes
// });

// console.log(`Result from dry running the transaction is: `,
//     dryRunResult,
// );





// console.log('Transfer transaction-------->', unsignedTx.signatures[0].toString('hex'));
// unsignedTx.params = transferParams;
// console.log('Unsigned: ', unsignedTx);

// const signedTx = transactions.signTransaction(
//     unsignedTx,
//     chainID,
//     Buffer.from(senderKeyInfo.privateKey, 'hex'),
//     transactionSchema.params
// );
// console.log('Signed: ', signedTx)



// console.log(tx.senderPublicKey.toString('hex'))


// validator.validator.validate(transactionSchema, unsignedTx);


// console.log('Transfer Params in script-------->', transferParams);


// const s = signTransactionOffline



// var { nonce } = await appClient.invoke('auth_getAuthAccount', {
//     address: address.getLisk32AddressFromPublicKey(Buffer.from(senderKeyInfo.publicKey, 'hex')),
// });

// const latestNonce = BigInt(parseInt(nonce) + 1);

// const sortedOptionalKeys = [Buffer.from(optionalAccount1.publicKey, 'hex'), Buffer.from(optionalAccount2.publicKey, 'hex')].sort((a, b) => a.compare(b));


// const optionalAccount1 = keys[2];
// const optionalAccount2 = keys[3];


// unsignedTx.signatures.push(ed.signData(TAG_TRANSACTION, chainID, unsignedTx.getSigningBytes(), Buffer.from(senderKeyInfo.privateKey, 'hex')));

// const txBytes = transactions.getBytes(unsignedTx, transferParamsSchema);

// console.log(txBytes.toString('hex'));
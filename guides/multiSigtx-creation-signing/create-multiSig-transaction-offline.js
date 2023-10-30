const { apiClient, cryptography, codec, Transaction, transactions } = require('lisk-sdk');
const { transferParamsSchema } = require('lisk-framework/dist-node/modules/token/schemas');
const { accounts } = require('./accounts.json');
const RPC_ENDPOINT = 'ws://127.0.0.1:7887/rpc-ws';

(async () => {
    const appClient = await apiClient.createWSClient(RPC_ENDPOINT);
    const chainID = Buffer.from('00000001', 'hex');
    const optionalAccount1 = accounts[0];
    const optionalAccount2 = accounts[1];
    const optionalAccount3 = accounts[2];
    const sortedOptionalKeys = [Buffer.from(optionalAccount1.publicKey, 'hex'), Buffer.from(optionalAccount2.publicKey, 'hex'), Buffer.from(optionalAccount3.publicKey, 'hex')].sort((a, b) => a.compare(b));
    const sortedMandatoryKeys = [];
    const senderKeyInfo = accounts[0];
    const latestNonce = BigInt(3);

    // const authAccountDetails = await appClient.invoke('auth_getAuthAccount', {
    //     address: mandatoryAccount1.address,
    // });

    const keys = {
        mandatoryKeys: sortedMandatoryKeys,
        optionalKeys: sortedOptionalKeys,
    };

    const tokenTransferParams = {
        tokenID: Buffer.from('0000000100000000', 'hex'),
        recipientAddress: cryptography.address.getAddressFromLisk32Address(accounts[1].address),
        amount: BigInt(20000000),
        data: 'Hello!',
    };

    const encodedTransferParams = codec.encode(transferParamsSchema, tokenTransferParams);

    const unSignedTx = new Transaction({
        module: 'token',
        command: 'transfer',
        nonce: latestNonce,
        senderPublicKey: Buffer.from(senderKeyInfo.publicKey, 'hex'),
        fee: BigInt(1000000),
        params: encodedTransferParams,
        signatures: [],
    });

    const txWithOneSig = transactions.signMultiSignatureTransaction(unSignedTx, chainID, Buffer.from(senderKeyInfo.privateKey, 'hex'), keys);

    console.log("Transaction with ONE signature ------>", txWithOneSig);
    console.log("");
    console.log("Transaction with ONE signature (HEX) ------>", transactions.getBytes(txWithOneSig).toString('hex'));
    console.log("");

    const signedTX = transactions.signMultiSignatureTransaction(txWithOneSig, chainID, Buffer.from(optionalAccount2.privateKey, 'hex'), keys);

    console.log("Transaction with BOTH signature ------>", signedTX);
    console.log("");
    console.log("Transaction with BOTH signature (HEX) ------>", transactions.getBytes(signedTX).toString('hex'));
    console.log("");

    const dryRunResult = await appClient.invoke('txpool_dryRunTransaction', {
        transaction: transactions.getSigningBytes(signedTX).toString('hex'),
    });

    console.log('Result from dry running the transaction is: ',
        dryRunResult,
    );

    const postTransactionResult = await appClient.invoke('txpool_postTransaction', {
        transaction: transactions.getSigningBytes(signedTX).toString('hex'),
    });

    console.log('Result from posting the transaction is: ',
        postTransactionResult,
    );

    process.exit(0);
})();
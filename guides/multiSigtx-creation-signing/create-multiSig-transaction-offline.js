const { apiClient, cryptography, codec, Transaction, transactions } = require('lisk-sdk');
const { transferParamsSchema } = require('lisk-framework/dist-node/modules/token/schemas');
const { accounts } = require('./accounts.json');
const RPC_ENDPOINT = '~/.lisk/pos-mainchain';

(async () => {
    const appClient = await apiClient.createIPCClient(RPC_ENDPOINT);
    const chainID = Buffer.from('04000000', 'hex');
    const mandatoryAccount1 = accounts[0];
    const mandatoryAccount2 = accounts[1];
    const sortedMandatoryKeys = [Buffer.from(mandatoryAccount1.publicKey, 'hex'), Buffer.from(mandatoryAccount2.publicKey, 'hex')].sort((a, b) => a.compare(b));
    const sortedOptionalKeys = [];
    const senderKeyInfo = accounts[0];
    const latestNonce = BigInt(2);

    const authAccountDetails = await appClient.invoke('auth_getAuthAccount', {
        address: mandatoryAccount1.address,
    });

    const keys = {
        mandatoryKeys: sortedMandatoryKeys,
        optionalKeys: sortedOptionalKeys,
    };

    const tokenTransferParams = {
        tokenID: Buffer.from('0400000000000000', 'hex'),
        recipientAddress: cryptography.address.getAddressFromLisk32Address(accounts[1].address),
        amount: BigInt(200000000000),
        data: 'Hello!',
    };

    // const encodedTransferParams = codec.encode(transferParamsSchema, tokenTransferParams);

    const unSignedTx = new Transaction({
        module: 'token',
        command: 'transfer',
        nonce: latestNonce,
        senderPublicKey: Buffer.from(senderKeyInfo.publicKey, 'hex'),
        fee: BigInt(1000000),
        params: tokenTransferParams,
        signatures: [],
    });

    const txWithOneSig = transactions.signMultiSignatureTransaction(unSignedTx, chainID, Buffer.from(senderKeyInfo.privateKey, 'hex'), keys, transferParamsSchema,);

    console.log("Transaction with ONE signature ------>", txWithOneSig);
    console.log("");
    console.log("Transaction with ONE signature (HEX) ------>", transactions.getBytes(txWithOneSig).toString('hex'));
    console.log("");

    const signedTX = transactions.signMultiSignatureTransaction(txWithOneSig, chainID, Buffer.from(mandatoryAccount2.privateKey, 'hex'), keys, transferParamsSchema);

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
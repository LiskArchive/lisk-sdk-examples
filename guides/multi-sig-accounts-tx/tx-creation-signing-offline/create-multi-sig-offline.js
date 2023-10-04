const { apiClient, cryptography, codec, transactions, Transaction } = require('lisk-sdk');
const { accounts } = require('../accounts.json');
const { transferParamsSchema } = require('../schemas');
const RPC_ENDPOINT = 'ws://127.0.0.1:7887/rpc-ws';

(async () => {
    const appClient = await apiClient.createWSClient(RPC_ENDPOINT);
    const chainID = Buffer.from('12345678', 'hex');
    const mandatoryAccount1 = accounts[0];
    const mandatoryAccount2 = accounts[1];

    const sortedMandatoryKeys = [Buffer.from(mandatoryAccount1.publicKey, 'hex'), Buffer.from(mandatoryAccount2.publicKey, 'hex')].sort((a, b) => a.compare(b));
    const sortedOptionalKeys = []
    const senderKeyInfo = accounts[0];
    const latestNonce = BigInt(2);

    const keys = {
        mandatoryKeys: sortedMandatoryKeys,
        optionalKeys: sortedOptionalKeys,
    };

    const tokenTransferParams = {
        tokenID: Buffer.from('1234567800000000', 'hex'),
        recipientAddress: cryptography.address.getAddressFromLisk32Address(accounts[1].address),
        amount: BigInt(1000),
        data: 'Hello!',
    };

    const encodedTransferParams = codec.encode(transferParamsSchema, tokenTransferParams);

    const unsignedTx = new Transaction({
        module: 'token',
        command: 'transfer',
        nonce: latestNonce,
        senderPublicKey: Buffer.from(senderKeyInfo.publicKey, 'hex'),
        fee: BigInt(100000000),
        params: tokenTransferParams,
        signatures: [],
    });

    const txWithOneSig = transactions.signMultiSignatureTransaction(unsignedTx, chainID, Buffer.from(mandatoryAccount2.privateKey, 'hex'), keys);

    const signedTX = transactions.signMultiSignatureTransaction(txWithOneSig, chainID, Buffer.from(senderKeyInfo.privateKey, 'hex'), keys);

    console.log(signedTX);

    const dryRunResult = await appClient.invoke('txpool_dryRunTransaction', {
        transaction: transactions.getBytes(signedTX).toString('hex'),
    });

    console.log(`Result from dry running the transaction is: `,
        dryRunResult,
    );

    const postTransactionResult = await appClient.invoke('txpool_postTransaction', {
        transaction: transactions.getBytes(signedTX).toString('hex'),
    });

    console.log(`Result from dry running the transaction is: `,
        postTransactionResult,
    );

    process.exit(0);
})();
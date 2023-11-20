const { apiClient, cryptography, codec, Transaction, transactions } = require('lisk-sdk');
const { transferParamsSchema } = require('lisk-framework/dist-node/modules/token/schemas');
const { accounts } = require('./accounts.json');
const signedTX = require('./signedTx.json');
const readline = require("readline");
const fs = require("fs");

// Change these values as per your node.
const RPC_ENDPOINT = 'ws://127.0.0.1:7887/rpc-ws';
const chainID = Buffer.from('00000001', 'hex');
const tokenID = Buffer.from('0000000100000000', 'hex');

let privateKeyStr;
const optionalAccount1 = accounts[0];
const optionalAccount2 = accounts[1];
const optionalAccount3 = accounts[2];
const sortedOptionalKeys = [Buffer.from(optionalAccount1.publicKey, 'hex'), Buffer.from(optionalAccount2.publicKey, 'hex'), Buffer.from(optionalAccount3.publicKey, 'hex')].sort((a, b) => a.compare(b));
const sortedMandatoryKeys = [];
const senderKeyInfo = accounts[0];
const latestNonce = BigInt(3);

const keys = {
    mandatoryKeys: sortedMandatoryKeys,
    optionalKeys: sortedOptionalKeys,
};

const tokenTransferParams = {
    tokenID: tokenID,
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
    params: tokenTransferParams,
    signatures: [],
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (process.argv.length < 3) {
    console.log("Please provide all the required parameter when executing the script:");
    console.log("node create-multiSig-transaction.js PRIVATEKEY");
    process.exit(1);
}

rl.question("Do you want to sign the transaction? 'yes'", function (confirmed) {
    confirmed = confirmed.toLowerCase();
    if (confirmed == "yes" || confirmed == "y") {
        privateKeyStr = process.argv[2];

        if (Object.keys(signedTX).length === 0) {
            // Take all the variables defined earlier and sign the transaction with the provided private key
            let txWithOneSig = transactions.signMultiSignatureTransaction(unSignedTx, chainID, Buffer.from(privateKeyStr, 'hex'), keys, transferParamsSchema);

            // Convert the signed transaction object into a JSON object
            txWithOneSig['senderPublicKey'] = unSignedTx.senderPublicKey.toString('hex');
            txWithOneSig['signatures'][0] = unSignedTx.signatures[0].toString('hex');
            txWithOneSig['signatures'][1] = unSignedTx.signatures[1].toString('hex');
            txWithOneSig['signatures'][2] = unSignedTx.signatures[2].toString('hex');
            txWithOneSig['id'] = txWithOneSig.id.toString('hex');
            txWithOneSig['params']['tokenID'] = tokenTransferParams.tokenID.toString('hex');
            txWithOneSig['params']['recipientAddress'] = tokenTransferParams.recipientAddress.toString('hex');
            try {
                // Write the JSON object to the 'signedTx.json' file so that it can be shared with the other signatory.
                fs.writeFileSync('signedTx.json', JSON.stringify(txWithOneSig, (_, v) => typeof v === 'bigint' ? v.toString() : v));
                console.log('The file is written successfully');
                console.log("Please now sign the transaction with a different Private Key!")
            } catch (err) {
                console.error('Error writing the file:', err);
            }
            process.exit(0);
        } else {
            // Convert the JSON object read on the 7th step back to the Lisk accepted format, for the signing process.
            signedTX['nonce'] = BigInt(signedTX.nonce);
            signedTX['fee'] = BigInt(signedTX.fee);
            signedTX['senderPublicKey'] = Buffer.from(signedTX.senderPublicKey, 'hex');
            signedTX['signatures'][0] = Buffer.from(signedTX.signatures[0], 'hex');
            signedTX['signatures'][1] = Buffer.from(signedTX.signatures[1], 'hex');
            signedTX['signatures'][2] = Buffer.from(signedTX.signatures[2], 'hex');
            signedTX['params']['tokenID'] = unSignedTx.params['tokenID'];
            signedTX['params']['recipientAddress'] = unSignedTx.params['recipientAddress'];
            signedTX['params']['amount'] = unSignedTx.params['amount'];
            signedTX['id'] = Buffer.from(signedTX.id, 'hex');

            // Sign the transaction using the second signatory's private key
            transactions.signMultiSignatureTransaction(signedTX, chainID, Buffer.from(privateKeyStr, 'hex'), keys, transferParamsSchema);
            const fullySignedTx = new Transaction(signedTX)
            fullySignedTx.params = encodedTransferParams

            // Get the hex string of the transaction which will be used in either dry running or sending the transaction to the node
            const fullySignedTxHex = fullySignedTx.getBytes().toString('hex');
            console.log(fullySignedTxHex);

            // Un-comment the following lines when in online mode and connected to a node to dry-run or post a transaction.
            // dryRun(fullySignedTxHex);
            // postTransaction(fullySignedTxHex);
            process.exit(0);
        }
    }
});

async function dryRun(fullySignedTxHex) {
    const appClient = await apiClient.createWSClient(RPC_ENDPOINT);
    const result = await appClient.invoke('txpool_dryRunTransaction', {
        transaction: fullySignedTxHex,
    });
    console.log('Result from dry running the transaction is: ', result);
}
async function postTransaction(fullySignedTxHex) {
    const appClient = await apiClient.createWSClient(RPC_ENDPOINT);
    const result = await appClient.invoke('txpool_postTransaction', {
        transaction: fullySignedTxHex,
    });
    console.log('Result from posting the transaction is: ', result);
    process.exit(0);
}
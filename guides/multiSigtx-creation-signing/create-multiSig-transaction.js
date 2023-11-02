const { apiClient, cryptography, codec, Transaction, transactions } = require('lisk-sdk');
const { transferParamsSchema } = require('lisk-framework/dist-node/modules/token/schemas');
const { accounts } = require('./accounts.json');
const signedTX = require('./signedTx.json');
const readline = require("readline");
const fs = require("fs");

const RPC_ENDPOINT = 'ws://127.0.0.1:7887/rpc-ws';
let privateKeyStr;
let existingSignedTx;
const chainID = Buffer.from('00000001', 'hex');
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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (process.argv.length < 3) {
    console.log("Please provide all the required parameter when executing the script:");
    console.log("node create-multiSig-transaction-offline.js PRIVATEKEY");
    process.exit(1);
}

fs.readFile('signedTx.json', (err, data) => {
    if (err) {
        existingSignedTx = '';
    }
    else {
        existingSignedTx = data.byteLength;
    }
})

rl.question("Confirm parameters with 'yes'", function (confirmed) {
    confirmed = confirmed.toLowerCase();
    if (confirmed == "yes" || confirmed == "y") {
        process.argv.forEach(function (val, index) {
            if (index === 2) {
                privateKeyStr = val;
            }
        });

        console.log("Please only proceed to sign the registration message if you confirm the correctness of the following parameters for the multi-signature registration:");

        if (existingSignedTx == 2) {
            console.log("Running this!")
            let txWithOneSig = transactions.signMultiSignatureTransaction(unSignedTx, chainID, Buffer.from(privateKeyStr, 'hex'), keys);
            txWithOneSig['senderPublicKey'] = unSignedTx.senderPublicKey.toString('hex');
            txWithOneSig['signatures'][0] = unSignedTx.signatures[0].toString('hex');
            txWithOneSig['signatures'][1] = unSignedTx.signatures[1].toString('hex');
            txWithOneSig['signatures'][2] = unSignedTx.signatures[2].toString('hex');
            txWithOneSig['params'] = unSignedTx.params.toString('hex');
            txWithOneSig['id'] = txWithOneSig.id.toString('hex');
            try {
                fs.writeFileSync('signedTx.json', JSON.stringify(txWithOneSig, (_, v) => typeof v === 'bigint' ? v.toString() : v));
                console.log('File written successfully');
            } catch (err) {
                console.error('Error writing the file:', err);
            }
        } else {
            console.log("Running THAT!")
            signedTX['nonce'] = BigInt(signedTX.nonce);
            signedTX['fee'] = BigInt(signedTX.fee);
            signedTX['senderPublicKey'] = Buffer.from(signedTX.senderPublicKey, 'hex');
            signedTX['signatures'][0] = Buffer.from(signedTX.signatures[0], 'hex');
            signedTX['signatures'][1] = Buffer.from(signedTX.signatures[1], 'hex');
            signedTX['signatures'][2] = Buffer.from(signedTX.signatures[2], 'hex');
            signedTX['params'] = Buffer.from(signedTX.params, 'hex');
            signedTX['id'] = Buffer.from(signedTX.id, 'hex');
            transactions.signMultiSignatureTransaction(signedTX, chainID, Buffer.from(privateKeyStr, 'hex'), keys);
            const fullySignedTx = new Transaction(signedTX)
            const fullySignedTxHex = fullySignedTx.getBytes().toString('hex');
            dryRun(fullySignedTxHex)

        }
    }
});

async function dryRun(fullySignedTxHex) {
    const appClient = await apiClient.createWSClient(RPC_ENDPOINT);
    // const result = await appClient.invoke('system_getNodeInfo');
    const result = await appClient.invoke('txpool_dryRunTransaction', {
        transaction: fullySignedTxHex,
    });
    console.log('Result from dry running the transaction is: ', result);
    console.log("\nBYE BYE !!!");
    process.exit(0);
}
/* global BigInt */

const { transactions, codec, cryptography } = require('@liskhq/lisk-client');
const { getIPCClient } = require('../api_client');
const { baseAssetSchema, tokenTransferSchema } = require('./schemas');
const { objects } = require('@liskhq/lisk-utils');

const calcMinTxFee = (assetSchema, minFeePerByte, tx) => {
	const assetBytes = codec.codec.encode(assetSchema, tx.asset);
	const bytes = codec.codec.encode(baseAssetSchema, { ...tx, asset: assetBytes });
	return BigInt(bytes.length * minFeePerByte);
};

const getFullAssetSchema = assetSchema => objects.mergeDeep({}, baseAssetSchema, { properties: { asset: assetSchema }, });

const createTransferTrx = async ({
    moduleID,
    assetID,
    asset,
    passphrase,
    fee,
    liskClient,
}) => {
    const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
        passphrase
    );
    const address = cryptography.getAddressFromPassphrase(passphrase);
    const {
        sequence: { nonce },
    } = await liskClient.account.get(address);
    const { networkIdentifier, genesisConfig } = await liskClient.node.getNodeInfo();

    const { id, ...rest } = transactions.signTransaction(
        tokenTransferSchema,
        {
            moduleID,
            assetID,
            nonce: BigInt(nonce),
            fee: BigInt(transactions.convertLSKToBeddows(fee)),
            senderPublicKey: publicKey,
            asset,
        },
        Buffer.from(networkIdentifier, 'hex'),
        passphrase,
    );

    return {
        id: id.toString('hex'),
        tx: codec.codec.toJSON(getFullAssetSchema(tokenTransferSchema), rest),
        minFee: calcMinTxFee(tokenTransferSchema, genesisConfig.minFeePerByte, rest),
    };
};

module.exports = {
    createTransferTrx,
    getFullAssetSchema,
    calcMinTxFee
};

/* global BigInt */

const { transactions, cryptography } = require('@liskhq/lisk-client');
const { tokenTransferSchema } = require('../schemas');
const { DEFAULT_FEE, TOKEN_MODULE_ID, TOKEN_TRANSFER_ASSET_ID } = require('../constants')

const transferToken = (
    codec,
    channel,
    nodeInfo,
) => async (req, res) => {
    try {
        const { passphrase, amount, recipientAddress, data, fee } = req.body;
        const asset = {
            recipientAddress: Buffer.from(recipientAddress, 'hex'),
            amount: BigInt(amount),
            data,
        };

        const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
            passphrase
        );
        const address = cryptography.getAddressFromPassphrase(passphrase);
        const account = await channel.invoke('app:getAccount', {
            address,
        });
        const { sequence: { nonce } } = codec.decodeAccount(account);

        const { id, ...tx } = transactions.signTransaction(
            tokenTransferSchema,
            {
                moduleID: TOKEN_MODULE_ID,
                assetID: TOKEN_TRANSFER_ASSET_ID,
                nonce: BigInt(nonce),
                fee: fee || DEFAULT_FEE,
                senderPublicKey: publicKey,
                asset,
            },
            Buffer.from(nodeInfo.networkIdentifier, 'hex'),
            passphrase,
        );
        const encodedTransaction = codec.encodeTransaction(tx);
        const result = await channel.invoke('app:postTransaction', {
          transaction: encodedTransaction,
        });

        res.status(200).json({ data: result, meta: {} });
      } catch (err) {
        res.status(409).json({
          errors: [{ message: err.message }],
        });
      }
};

module.exports = {
    transferToken,
};

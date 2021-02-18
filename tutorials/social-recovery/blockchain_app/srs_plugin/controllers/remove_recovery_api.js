/* global BigInt */

const { transactions, cryptography } = require('@liskhq/lisk-client');
const { initiateRecoverySchema } = require('../schemas');
const { SRS_MODULE_ID, DEFAULT_FEE, SRS_REMOVE_ASSET_ID } = require('../constants');

const removeRecovery = (
    codec,
    channel,
    nodeInfo,
) => async (req, res) => {
    const { passphrase, fee } = req.body;
    const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
        passphrase
    );
    const address = cryptography.getAddressFromPassphrase(passphrase);
    const account = await channel.invoke('app:getAccount', {
        address,
    });
    const { sequence: { nonce } } = codec.decodeAccount(account);

    const { id, ...tx } = transactions.signTransaction(
        {},
        {
            moduleID: SRS_MODULE_ID,
            assetID: SRS_REMOVE_ASSET_ID,
            nonce: BigInt(nonce),
            fee: fee || DEFAULT_FEE,
            senderPublicKey: publicKey,
            asset,
        },
        Buffer.from(nodeInfo.networkIdentifier, 'hex'),
        passphrase,
    );

    try {
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
    removeRecovery,
};

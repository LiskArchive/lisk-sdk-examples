const { BaseAsset, cryptography } = require('lisk-sdk');

const validateSignature = (
	publicKey,
	signature,
	transactionBytes,
	id,
) => {
	const valid = cryptography.verifyData(transactionBytes, signature, publicKey);

	if (!valid) {
		throw new Error(
			`Failed to validate signature '${signature.toString(
				'hex',
			)}' for transaction with id '${id.toString('hex')}'`,
		);
	}
};

class VouchRecoveryAsset extends BaseAsset {
	name = 'vouchRecovery';
	id = 2;
	schema = {
        $id: 'srs/recovery/vouch',
        type: 'object',
        required: ['lostAccount', 'rescuer'],
        properties: {
            rescuer: {
                dataType: 'bytes',
                fieldNumber: 1,
              },
            lostAccount: {
                dataType: 'bytes',
                fieldNumber: 2,
            },
        },
    };

    async apply({
		asset,
		transaction,
		stateStore,
	}) {
        const sender = await stateStore.account.get(transaction.senderAddress);
        const lostAccount = await stateStore.account.get(asset.lostAccount);
        const rescuer = await stateStore.account.get(asset.rescuer);

        if (!lostAccount.srs.status.rescuer.equals(rescuer.address)) {
            throw new Error(`Rescuer address is incorrect for the recovery of ${lostAccount.address.toString('hex')}`)
        }

        const { networkIdentifier } = stateStore.chain;
        const transactionBytes = transaction.getSigningBytes();

		const transactionWithNetworkIdentifierBytes = Buffer.concat([
			networkIdentifier,
			transactionBytes,
		]);

        validateSignature(
            transaction.senderPublicKey,
            transaction.signatures[0],
            transactionWithNetworkIdentifierBytes,
            transaction.id,
        );

        const found = lostAccount.srs.config.friends.find(f => f.equals(sender.address));

        if (!found) {
            throw new Error('The sender is not part of friends who can vouch for rescuer for recovery process.')
        }

        const foundSignature = lostAccount.srs.status.vouchList.find(f => f.equals(sender.address));
        if (foundSignature) {
            throw new Error('The sender has already vouched for the rescuer for recovery process.')
        }

        // Push signature to vouch list
        lostAccount.srs.status.vouchList.push(transaction.signatures[0]);
        await stateStore.account.set(lostAccount.address, lostAccount);
    }
}

module.exports = VouchRecoveryAsset;

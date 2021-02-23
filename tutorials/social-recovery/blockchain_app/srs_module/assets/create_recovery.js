const { BaseAsset, transactions } = require('lisk-sdk');

const BASE_RECOVERY_DEPOSIT = '1000000000';
const FRIEND_FACTOR_FEE = 2;

class CreateRecoveryAsset extends BaseAsset {
	name = 'createRecovery';
	id = 0;
	schema = {
        $id: 'srs/recovery/create',
        type: 'object',
        required: ['friends', 'recoveryThreshold', 'delayPeriod'],
        properties: {
            friends: {
                type: 'array',
                fieldNumber: 1,
                items: {
                    dataType: 'bytes',
                },
            },
            recoveryThreshold: {
                dataType: 'uint32',
                fieldNumber: 2,
              },
            delayPeriod: {
                dataType: 'uint32',
                fieldNumber: 3,
            },
        },
    };

    async apply({
		asset,
		transaction,
		stateStore,
	}) {
        const sender = await stateStore.account.get(transaction.senderAddress);
        if (sender.srs.config && sender.srs.config.friends.length !== 0) {
            throw Error('Account already has a recovery configuration.')
        }
        const sameAccount = asset.friends.find(f => f === sender.address);
        if (sameAccount) {
            throw new Error('You cannot add yourself to the friend list.');
        }
        // Add friends to the list
        sender.srs.config.friends = [...asset.friends.sort()];
        // Minimum number of friends required to vouch
        sender.srs.config.recoveryThreshold = asset.recoveryThreshold;
        // Minimum number of blocks after recovery process when account will be recoverable
        sender.srs.config.delayPeriod = asset.delayPeriod;
        // Set the deposit based on number of friends, 10 + friends.length * 2
        const deposit = BigInt(BASE_RECOVERY_DEPOSIT) + BigInt(transactions.convertLSKToBeddows((sender.srs.config.friends.length * FRIEND_FACTOR_FEE).toString()));
        sender.srs.config.deposit = deposit;
        // Save the value in stateStore
        await stateStore.account.set(sender.address, sender);
    }
}

module.exports = CreateRecoveryAsset;

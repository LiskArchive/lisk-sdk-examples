const { BaseAsset } = require('lisk-sdk');

class ClaimRecoveryAsset extends BaseAsset {
	name = 'claimRecovery';
	id = 3;
	schema = {
        $id: 'srs/recovery/claim',
        type: 'object',
        required: ['lostAccount'],
        properties: {
            lostAccount: {
                dataType: 'bytes',
                fieldNumber: 1,
            },
        },
    };

    async apply({
		asset,
		transaction,
		stateStore,
        reducerHandler,
	}) {
        const rescuer = await stateStore.account.get(transaction.senderAddress);
        const lostAccount = await stateStore.account.get(asset.lostAccount);

        const currentHeight = stateStore.chain.lastBlockHeaders[0].height;
        const delayPeriod = lostAccount.srs.config.delayPeriod;
        const recoveryThreshold = lostAccount.srs.config.recoveryThreshold;
        const deposit = lostAccount.srs.config.deposit;

        if ((currentHeight - rescuer.srs.status.created) < delayPeriod) {
            throw new Error(`Cannot claim account before delay period of ${delayPeriod}.`);
        }

        if (lostAccount.srs.status.vouchList.length < recoveryThreshold) {
            throw new Error(`Cannot claim account until minimum threshold of ${lostAccount.srs.config.friends.length} friends have vouched.`);
        }

        const lostAccountBalance = await reducerHandler.invoke('token:getBalance', {
            address: lostAccount.address,
        });

        await reducerHandler.invoke('token:credit', {
            address: rescuer.address,
            amount: deposit + lostAccountBalance,
        });

        // Reset recovery status
        await stateStore.account.set(rescuer.address, rescuer);
        // Delete the lost account
        await stateStore.account.del(lostAccount.address);
	}
}

module.exports = ClaimRecoveryAsset;

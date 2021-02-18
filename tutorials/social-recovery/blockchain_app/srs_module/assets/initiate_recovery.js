const { BaseAsset } = require('lisk-sdk');

class InitiateRecoveryAsset extends BaseAsset {
	name = 'initiateRecovery';
	id = 1;
	schema = {
        $id: 'srs/recovery/initiate',
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

        const sameAccount = lostAccount.srs.config.friends.find(f => f === rescuer.address);
        if (sameAccount) {
            throw new Error('You cannot recover your own account.');
        }

        // Check if recovery configuration is present for the lost account or not
        if (lostAccount.srs.config && lostAccount.srs.config.friends.length === 0) {
            throw Error('Lost account already has no recovery configuration.')
        }

        const currentHeight = stateStore.chain.lastBlockHeaders[0].height;
        const deposit = lostAccount.srs.config.deposit;

        // Check if rescuer account have enough balance
        const minRemainingBalance = await reducerHandler.invoke(
            'token:getMinRemainingBalance'
          );

        if (deposit > minRemainingBalance) {
            throw new Error('Rescuer doesnt have enough balance to deposit for recovery process.');
        }
        // Deduct the balance from rescuer and update rescuer account
        await reducerHandler.invoke('token:debit', {
            address: rescuer.address,
            amount: deposit,
          });

        lostAccount.srs.status.active = true;
        lostAccount.srs.status.rescuer = rescuer.address;
        lostAccount.srs.status.created = currentHeight;
        lostAccount.srs.status.deposit = deposit;
        lostAccount.srs.status.vouchList = [];

        await stateStore.account.set(rescuer.address, rescuer);
        await stateStore.account.set(lostAccount.address, lostAccount);
    }
}

module.exports = InitiateRecoveryAsset;

const { BaseAsset } = require('lisk-sdk');

class CloseRecoveryAsset extends BaseAsset {
	name = 'closeRecovery';
	id = 4;
	schema = {
        $id: 'srs/recovery/close',
        type: 'object',
        required: ['rescuer'],
        properties: {
            rescuer: {
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
        const lostAccount = await stateStore.account.get(transaction.senderAddress);
        if (!lostAccount.srs.status.active) {
            throw new Error(`No active recovery found for address ${lostAccount.address}.`);
        }
        if (!lostAccount.srs.status.rescuer.equals(asset.rescuer)) {
            throw new Error(`Incorrect rescuer address`);
        }

        const rescuer = await stateStore.account.get(asset.rescuer);

        await reducerHandler.invoke('token:debit', {
            address: rescuer.address,
            amount: rescuer.srs.config.deposit,
          });

        await reducerHandler.invoke('token:credit', {
            address: lostAccount.address,
            amount: lostAccount.srs.config.deposit,
          });

        lostAccount.srs.config.active = false;
        lostAccount.srs.status.rescuer = rescuer.address;
        lostAccount.srs.status.created = currentHeight;
        lostAccount.srs.status.deposit = deposit;
        lostAccount.srs.status.vouchList = [];
        await stateStore.account.set(rescuer.address, rescuer);
    }
}

module.exports = CloseRecoveryAsset;

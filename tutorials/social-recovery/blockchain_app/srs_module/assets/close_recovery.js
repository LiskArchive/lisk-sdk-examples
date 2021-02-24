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
            throw new Error(`No active recovery found for address ${lostAccount.address.toString('hex')}.`);
        }
        if (!lostAccount.srs.status.rescuer.equals(asset.rescuer)) {
            throw new Error(`Incorrect rescuer address`);
        }

        const rescuer = await stateStore.account.get(asset.rescuer);

        // Debit deposit amount from the rescuer and credit to the lost account
        await reducerHandler.invoke('token:debit', {
            address: rescuer.address,
            amount: lostAccount.srs.config.deposit,
          });

        await reducerHandler.invoke('token:credit', {
            address: lostAccount.address,
            amount: lostAccount.srs.config.deposit,
          });

        // Reset recovery status
        lostAccount.srs.status.active = false;
        lostAccount.srs.status.rescuer = Buffer.from('');
        lostAccount.srs.status.created = 0;
        lostAccount.srs.status.deposit = BigInt('0');
        lostAccount.srs.status.vouchList = [];
        await stateStore.account.set(lostAccount.address, lostAccount);
    }
}

module.exports = CloseRecoveryAsset;

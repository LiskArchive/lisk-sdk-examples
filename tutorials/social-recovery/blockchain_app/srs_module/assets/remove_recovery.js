const { BaseAsset } = require('lisk-sdk');

class RemoveRecoveryAsset extends BaseAsset {
	name = 'removeRecovery';
	id = 5;
    schema = {};

    async apply({
		transaction,
		stateStore,
        reducerHandler,
	}) {
        const lostAccount = await stateStore.account.get(transaction.senderAddress);
        if (sender.srs.config && sender.srs.config.friends.length !== 0) {
            throw Error('Account already has a recovery configuration.')
        }

        const deposit = lostAccount.srs.config.deposit;

        await reducerHandler.invoke('token:credit', {
            address: lostAccount.address,
            amount: deposit,
          });

        lostAccount.srs.config.friends = [];
        lostAccount.srs.config.recoveryThreshold = 0;
        lostAccount.srs.config.delayPeriod = 0;
        await stateStore.account.set(sender.address, sender);
    }
}

module.exports = RemoveRecoveryAsset;

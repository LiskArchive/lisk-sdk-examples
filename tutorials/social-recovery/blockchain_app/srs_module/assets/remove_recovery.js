const {
	BaseAsset
} = require('lisk-sdk');

class RemoveRecoveryAsset extends BaseAsset {
	name = 'removeRecovery';
	id = 5;
	schema = {
		$id: 'srs/recovery/remove',
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
		transaction,
		stateStore,
		reducerHandler,
	}) {
		const lostAccount = await stateStore.account.get(transaction.senderAddress);

		if (lostAccount.srs.config.friends.length === 0) {
			throw Error('Account does not have a recovery configuration.')
		}

		if (lostAccount.srs.status.active) {
			throw Error('There is active recovery in process. Please close the recovery to remove recovery configuration.')
		}

		const deposit = lostAccount.srs.config.deposit;

		// Unlock the deposit and give it back
		await reducerHandler.invoke('token:credit', {
			address: lostAccount.address,
			amount: deposit,
		});

		// Reset all the default values
		lostAccount.srs.config.friends = [];
		lostAccount.srs.config.recoveryThreshold = 0;
		lostAccount.srs.config.delayPeriod = 0;
		lostAccount.srs.config.deposit = BigInt('0');
		lostAccount.srs.status.rescuer = Buffer.from('');
		lostAccount.srs.status.deposit = BigInt('0');
		lostAccount.srs.status.vouchList = [];
		lostAccount.srs.status.created = 0;
		lostAccount.srs.status.active = false;
		await stateStore.account.set(lostAccount.address, lostAccount);
	}
}

module.exports = RemoveRecoveryAsset;

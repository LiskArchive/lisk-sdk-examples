const { BaseAsset } = require('lisk-sdk');
const { closeRecoverySchema } = require('../schemas');
const { CLOSE_RECOVERY_ASSET_ID } = require('../constants');

class CloseRecoveryAsset extends BaseAsset {
	name = 'closeRecovery';
	id = CLOSE_RECOVERY_ASSET_ID;
	schema = closeRecoverySchema;

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

        // Credit deposit amount to the lost account
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

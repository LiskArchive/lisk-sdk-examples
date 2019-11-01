const {
    BaseTransaction,
    TransactionError,
} = require('@liskhq/lisk-transactions');

/**
 * Send light alarm transaction when the packet has been opened (accepts timestamp).
 * Self-signed by packet.
 */
class LightAlarmTransaction extends BaseTransaction {

    static get TYPE () {
        return 23;
    }

    static get FEE () {
        return '0';
    };

    async prepare(store) {
        await store.account.cache([
            {
                address: this.senderId, // Sent by packet (self-signed)
            }
        ]);
    }

    validateAsset() {
        const errors = [];
        /* Static checks for presence of `timestamp` which holds the timestamp of when the alarm was triggered */
        if (!this.timestamp || typeof this.timestamp !== 'number') {
            errors.push(
                new TransactionError(
                    'Invalid ".timestamp" defined on transaction',
                    this.id,
                    '.timestamp',
                    this.timestamp,
                    'A timestamp in unix format'
                )
            );
        }
        return errors;
    }

    applyAsset(store) { /* Write the logic for applyAsset() here */ }

    undoAsset(store) {
        const errors = [];
        /* --- Revert packet status --- */
        packet.asset.status = null;
        packet.asset.alarms.light.pop();

        store.account.set(packet.address, packet);
        return errors;
    }

}

module.exports = LightAlarmTransaction;

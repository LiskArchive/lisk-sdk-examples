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
        return 21;
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
        /**
         * Get sender and recipient accounts of the packet
         */
        const pckt = store.account.get(this.senderId);
        await store.account.cache([
            {
                address: pckt.asset.carrier,
            },
            {
                address: pckt.asset.sender,
            },
        ]);
    }

    validateAsset() {
        // Static checks for presence of `timestamp` which holds the timestamp of when the alarm was triggered
        // `timestamp` is not used for further validation, we just use it for keeping track when the alarm has been fired.
        // Currently, we do not care about the format of the timestamp (require type string)
        const errors = [];
        if (!this.timestamp || typeof this.timestamp !== 'number') {
            errors.push(
                new TransactionError(
                    'Invalid ".timestamp" defined on transaction',
                    this.id,
                    '.timestamp',
                    this.timestamp
                )
            );
        }
        return errors;
    }

    applyAsset(store) {
        const errors = [];

        // Check status="ongoing" to accept the LightAlarmTransaction
        const packet = store.account.get(this.senderId);
        if (packet.asset.status !== 'ongoing') {
            errors.push(
                new TransactionError(
                    'Transaction invalid because delivery is not "ongoing".',
                    this.id,
                    'packet.asset.status',
                    packet.asset.status,
                    `Expected status to be equal to "ongoing"`,
                )
            );

            return errors;
        }
        const packet = store.account.get(this.recipientId);
        const carrier = store.account.get(packet.asset.carrier);
        const sender = store.account.get(packet.asset.sender);
        const senderBalanceWithSecurityAndPorto = new utils.BigNum(sender.balance).add(new utils.BigNum(packet.asset.security)).add(new utils.BigNum(packet.asset.porto));

        sender.balance = senderBalanceWithSecurityAndPorto;

        store.account.set(sender.address, sender);
        /**
         * Update the Carrier account:
         * - Reduce trust by 1
         * - Set lockedSecurity to 0
         */
        const updatedTrust = --carrier.asset.trust;

        carrier.asset.trust = updatedTrust;
        carrier.asset.lockedSecurity = null;

        store.account.set(carrier.address, updatedCarrier);
        /**
         * Update the Packet account:
         * - set status to "fail"
         * - Remove porto from balance
         */
        packet.balance = '0';
        packet.asset.status = 'fail';

        store.account.set(packet.address, packet);

        return errors;
    }

    undoAsset(store) {
        const errors = [];

        // No changes to store -> no need for undo logic
        return errors;
    }

}

module.exports = LightAlarmTransaction;

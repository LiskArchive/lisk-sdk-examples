/*
 * Copyright © 2020 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */
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
        // Static checks for presence of `timestamp` which holds the timestamp of when the alarm was triggered
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

        const packet = store.account.get(this.senderId);
        if (packet.asset.status !== 'ongoing' && packet.asset.status !== 'alarm') {
            errors.push(
                new TransactionError(
                    'Transaction invalid because delivery is not "ongoing".',
                    this.id,
                    'packet.asset.status',
                    packet.asset.status,
                    `Expected status to be equal to "ongoing" or "alarm"`,
                )
            );

            return errors;
        }

        /**
         * Update the Packet account:
         * - set packet status to "alarm"
         * - add current timestamp to light alarms list
         */
        packet.asset.status = 'alarm';
        packet.asset.alarms = packet.asset.alarms ? packet.asset.alarms : {};
        packet.asset.alarms.light = packet.asset.alarms.light ? packet.asset.alarms.light : [];
        packet.asset.alarms.light.push(this.timestamp);

        store.account.set(packet.address, packet);

        return errors;
    }

    undoAsset(store) {
        const errors = [];
        const packet = store.account.get(this.senderId);

        /* --- Revert packet status --- */
        packet.asset.status = 'ongoing';
        packet.asset.alarms.light.pop();

        store.account.set(packet.address, packet);
        return errors;
    }

}

module.exports = LightAlarmTransaction;

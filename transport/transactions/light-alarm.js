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
                address: this.senderId,
            }
        ]);
    }

    validateAsset() {
        const errors = [];
        /*
        Implement your own logic here.
        Static checks for presence of `timestamp` which holds the timestamp of when the alarm was triggered
        */

        return errors;
    }

    async applyAsset(store) {
        /* Insert the logic for applyAsset() here */
    }

    async undoAsset(store) {
        const errors = [];
        const packet = await store.account.get(this.senderId);

        /* --- Revert packet status --- */
        packet.asset.status = null;
        packet.asset.alarms.light.pop();

        store.account.set(packet.address, packet);
        return errors;
    }

}

module.exports = LightAlarmTransaction;

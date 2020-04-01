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
    utils
} = require('@liskhq/lisk-transactions');

class FinishTransportTransaction extends BaseTransaction {

    static get TYPE () {
        return 22;
    }

    static get FEE () {
        //return `${10 ** 8}`;
        return '0';
    };

    async prepare(store) {
        /**
         * Get packet account
         */
        await store.account.cache([
            {
                address: this.asset.recipientId,
            }
        ]);
        /**
         * Get sender and recipient accounts of the packet
         */
        const pckt = store.account.get(this.asset.recipientId);
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
        const errors = [];
        if (!this.asset.recipientId || typeof this.asset.recipientId !== 'string') {
            errors.push(
                new TransactionError(
                    'Invalid "asset.packetId" defined on transaction',
                    this.id,
                    '.asset.packetId',
                    this.asset.recipientId
                )
            );
        }
        return errors;
    }

    applyAsset(store) {
        const errors = [];
        let packet = store.account.get(this.asset.recipientId);
        let carrier = store.account.get(packet.asset.carrier);
        let sender = store.account.get(packet.asset.sender);
        // if the transaction has been signed by the packet recipient
        if (this.asset.senderId === packet.carrier) {
            // if the packet status isn't "ongoing" or "alarm"
            if (packet.asset.status !==  "ongoing" && packet.asset.status !== "alarm") {
                errors.push(
                    new TransactionError(
                        'FinishTransport can only be triggered, if packet status is "ongoing" or "alarm" ',
                        this.id,
                        'ongoing or alarm',
                        this.asset.status
                    )
                );
                return errors;
            }
            // if the transport was a success
            if (this.asset.status === "success") {
                /**
                 * Update the Carrier account:
                 * - Unlock security
                 * - Add postage & security to balance
                 * - Earn 1 trustpoint
                 */
                /* Write your own code here */
                /**
                 * Update the Packet account:
                 * - Remove postage from balance
                 * - Change status to "success"
                 */
                /* Write your own code here */
                return errors;
            }
            // if the transport failed
            /**
             * Update the Sender account:
             * - Add postage and security to balance
             */
            const senderBalanceWithSecurityAndPostage = new utils.BigNum(sender.balance).add(new utils.BigNum(packet.asset.security)).add(new utils.BigNum(packet.asset.postage));

            sender.balance = senderBalanceWithSecurityAndPostage.toString();

            store.account.set(sender.address, sender);
            /**
             * Update the Carrier account:
             * - Reduce trust by 1
             * - Set lockedSecurity to 0
             */
            carrier.asset.trust = carrier.asset.trust ? --carrier.asset.trust : -1;
            carrier.asset.lockedSecurity = null;

            store.account.set(carrier.address, carrier);
            /**
             * Update the Packet account:
             * - set status to "fail"
             * - Remove postage from balance
             */
            packet.balance = '0';
            packet.asset.status = 'fail';

            store.account.set(packet.address, packet);

            return errors;
        }
        errors.push(
            new TransactionError(
                'FinishTransport transaction needs to be signed by the recipient of the packet',
                this.id,
                '.asset.recipient',
                this.asset.recipient
            )
        );
        return errors;
    }

    undoAsset(store) {
        const errors = [];
        const packet = store.account.get(this.asset.recipientId);
        const carrier = store.account.get(packet.carrier);
        const sender = store.account.get(packet.sender);
        /* --- Revert successful transport --- */
        if ( this.asset.status === "success") {
            /* --- Revert carrier account --- */
            const carrierBalanceWithoutSecurityAndPostage = new utils.BigNum(carrier.balance).sub(new utils.BigNum(packet.asset.security)).sub(new utils.BigNum(packet.asset.postage));

            carrier.balance = carrierBalanceWithoutSecurityAndPostage.toString();
            carrier.asset.lockedSecurity = packet.asset.security;
            carrier.asset.trust--;

            store.account.set(carrier.address, carrier);

        /* --- Revert failed transport --- */
        } else {
            /* --- Revert sender account --- */
            const senderBalanceWithoutSecurityAndPostage = new utils.BigNum(sender.balance).sub(new utils.BigNum(packet.asset.security)).sub(new utils.BigNum(packet.asset.postage));
            sender.balance = senderBalanceWithoutSecurityAndPostage.toString();
            store.account.set(sender.address, sender);
            /* --- Revert carrier account --- */
            carrier.asset.trust++;
            carrier.asset.lockedSecurity = packet.asset.security;
            store.account.set(carrier.address, carrier);
        }
        /* --- Revert packet account --- */
        packet.balance = packet.asset.postage;
        packet.asset.status = "ongoing";

        store.account.set(packet.address, packet);
        return errors;
    }
}

module.exports = FinishTransportTransaction;

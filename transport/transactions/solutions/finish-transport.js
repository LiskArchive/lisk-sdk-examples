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

class FinishTransportTransaction extends BaseTransaction {

    static get TYPE () {
        return 22;
    }

    async prepare(store) {
        /**
         * Get packet account
         */
        await store.account.cache([
            {
                address: this.asset.packetId,
            }
        ]);
        /**
         * Get sender and recipient accounts of the packet
         */
        const pckt = await store.account.get(this.asset.packetId);
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
        if (!this.asset.packetId || typeof this.asset.packetId !== 'string') {
            errors.push(
                new TransactionError(
                    'Invalid "asset.packetId" defined on transaction',
                    this.id,
                    '.asset.packetId',
                    this.asset.packetId
                )
            );
        }
        return errors;
    }

    async applyAsset(store) {
        const errors = [];
        let packet = await store.account.get(this.asset.packetId);
        let carrier = await store.account.get(packet.asset.carrier);
        let sender = await store.account.get(packet.asset.sender);
        // if the transaction has been signed by the packet recipient
        console.log('this.asset.senderId: ' + this.senderId);
        console.log('packet.asset.recipient: ' + packet.asset.recipient);
        const cmpr = this.senderId === packet.asset.recipient;
        console.log('cmpr: ' + cmpr);
        if (this.senderId === packet.asset.recipient) {
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
            if ( this.asset.status === "success") {
                /**
                 * Update the Carrier account:
                 * - Unlock security
                 * - Add postage & security to balance
                 * - Earn 1 trustpoint
                 */
                const carrierBalanceWithSecurityAndPostage = carrier.balance + BigInt(packet.asset.security) + BigInt(packet.asset.postage);
                const trustInc = carrier.asset.trust ? BigInt(carrier.asset.trust) + BigInt(1) : BigInt(1);
                carrier.balance = carrierBalanceWithSecurityAndPostage;

                carrier.asset = {
                    ...carrier.asset,
                    trust: trustInc.toString(),
                    lockedSecurity: null
                };

                store.account.set(carrier.address, carrier);
                /**
                 * Update the Packet account:
                 * - Remove postage from balance
                 * - Change status to "success"
                 */
                packet.balance = BigInt(0);
                packet.asset = {
                    ...packet.asset,
                    status: 'success'
                }

                store.account.set(packet.address, packet);
                return errors;
            }
            // if the transport failed
            /**
             * Update the Sender account:
             * - Add postage and security to balance
             */
            const senderBalanceWithSecurityAndPostage = BigInt(sender.balance) + BigInt(packet.asset.security) + BigInt(packet.asset.postage);
            const trustDec = carrier.asset.trust ? BigInt(carrier.asset.trust) - BigInt(1) : BigInt(-1);

            sender.balance = senderBalanceWithSecurityAndPostage;

            store.account.set(sender.address, sender);
            /**
             * Update the Carrier account:
             * - Reduce trust by 1
             * - Set lockedSecurity to 0
             */
            carrier.asset = {
                ...carrier.asset,
                trust: trustDec.toString(),
                lockedSecurity: null
            }

            store.account.set(carrier.address, carrier);
            /**
             * Update the Packet account:
             * - set status to "fail"
             * - Remove postage from balance
             */
            packet.balance = BigInt('0');
            packet.asset = {
                ...packet.asset,
                status: 'fail'
            };

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

    async undoAsset(store) {
        const errors = [];
        const packet = await store.account.get(this.asset.packetId);
        const carrier = await store.account.get(packet.carrier);
        const sender = await store.account.get(packet.sender);
        /* --- Revert successful transport --- */
        if ( this.asset.status === "success") {
            /* --- Revert carrier account --- */
            const carrierBalanceWithoutSecurityAndPostage = BigInt(carrier.balance) = BigInt(packet.asset.security) - BigInt(packet.asset.postage);

            carrier.balance = carrierBalanceWithoutSecurityAndPostage.toString();
            carrier.asset.lockedSecurity = packet.asset.security;
            carrier.asset.trust--;

            store.account.set(carrier.address, carrier);

        /* --- Revert failed transport --- */
        } else {
            /* --- Revert sender account --- */
            const senderBalanceWithoutSecurityAndPostage = BigInt(sender.balance) - BigInt(packet.asset.security) - BigInt(packet.asset.postage);
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

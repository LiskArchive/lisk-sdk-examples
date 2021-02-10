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
                carrier.balance = carrier.balance + BigInt(packet.asset.security) + BigInt(packet.asset.postage);
                const trustInc = carrier.asset.trust ? BigInt(carrier.asset.trust) + BigInt(1) : BigInt(1);

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
            sender.balance = sender.balance + BigInt(packet.asset.security) + BigInt(packet.asset.postage);

            store.account.set(sender.address, sender);
            /**
             * Update the Carrier account:
             * - Reduce trust by 1
             * - Set lockedSecurity to 0
             */
            const trustDec = carrier.asset.trust ? BigInt(carrier.asset.trust) - BigInt(1) : BigInt(-1);
            carrier.asset = {
                ...carrier.asset,
                trust: trustDec.toString(),
                lockedSecurity: null
            };

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
        const packet = await store.account.get(this.asset.recipientId);
        const carrier = await store.account.get(packet.asset.carrier);
        const sender = await store.account.get(packet.asset.sender);
        /* --- Revert successful transport --- */
        if ( this.asset.status === "success") {
            /* --- Revert carrier account --- */
            carrier.balance = carrier.balance - BigInt(packet.asset.security) - BigInt(packet.asset.postage);

            const trustDec = carrier.asset.trust ? BigInt(carrier.asset.trust) - BigInt(1) : BigInt(-1);
            carrier.asset = {
                ...carrier.asset,
                trust: trustDec.toString(),
                lockedSecurity: packet.asset.security
            };

            store.account.set(carrier.address, carrier);

            /* --- Revert failed transport --- */
        } else {
            /* --- Revert sender account --- */
            sender.balance = sender.balance - BigInt(packet.asset.security) - BigInt(packet.asset.postage);
            store.account.set(sender.address, sender);
            /* --- Revert carrier account --- */
            const trustInc = carrier.asset.trust ? BigInt(carrier.asset.trust) + BigInt(1) : BigInt(1);
            carrier.asset = {
                ...carrier.asset,
                trust: trustInc.toString(),
                lockedSecurity: packet.asset.security
            };
            store.account.set(carrier.address, carrier);
        }
        /* --- Revert packet account --- */
        packet.balance = packet.asset.postage;
        packet.asset.status = "ongoing";
        packet.asset = {
            ...packet.asset,
            status: 'ongoing'
        };

        store.account.set(packet.address, packet);
        return errors;
    }
}

module.exports = FinishTransportTransaction;

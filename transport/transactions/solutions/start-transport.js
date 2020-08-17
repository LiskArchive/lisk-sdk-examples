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

class StartTransportTransaction extends BaseTransaction {

    static get TYPE () {
        return 21;
    }

    static get FEE () {
        //return `${10 ** 8}`;
        return '0';
    };

    async prepare(store) {
        await store.account.cache([
            {
                address: this.asset.recipientId,
            },
            {
                address: this.senderId,
            }
        ]);
    }

    validateAsset() {
        const errors = [];

        return errors;
    }

    async applyAsset(store) {
        const errors = [];
        const packet = await store.account.get(this.asset.recipientId);
        if (packet.asset.status === "pending"){
            const carrier = await store.account.get(this.senderId);
            // If the carrier has the trust to transport the packet
            const carrierTrust = carrier.asset.trust ? carrier.asset.trust : 0;
            const carrierBalance = new utils.BigNum(carrier.balance);
            const packetSecurity = new utils.BigNum(packet.asset.security);
            if (packet.asset.minTrust <= carrierTrust && carrierBalance.gte(packetSecurity)) {
                /**
                 * Update the Carrier account:
                 * - Lock security inside the account
                 * - Remove the security form balance
                 * - initialize carriertrust, if not present already
                 */
                const carrierBalanceWithoutSecurity = carrierBalance.sub(packetSecurity);
                const carrierTrust = carrier.asset.trust ? carrier.asset.trust : 0;
                carrier.balance = carrierBalanceWithoutSecurity.toString();
                carrier.asset = {
                    trust: carrierTrust,
                    lockedSecurity: packet.asset.security,
                };
                store.account.set(carrier.address, carrier);
                /**
                 * Update the Packet account:
                 * - Set status to "ongoing"
                 * - set carrier to ID of the carrier
                 */
                packet.asset.status = "ongoing";
                packet.asset.carrier = carrier.address;
                store.account.set(packet.address, packet);
            } else {
                errors.push(
                    new TransactionError(
                        'carrier has not enough trust to deliver the packet, or not enough balance to pay the security',
                        packet.asset.minTrust,
                        carrier.asset.trust,
                        packet.asset.security,
                        carrier.balance
                    )
                );
            }
        } else {
            errors.push(
                new TransactionError(
                    'packet status needs to be "pending"',
                    packet.asset.status
                )
            );
        }

        return errors;
    }

    async undoAsset(store) {
        const errors = [];
        const packet = await store.account.get(this.asset.recipientId);
        const carrier = await store.account.get(this.senderId);
        /* --- Revert carrier account --- */
        const carrierBalanceWithSecurity = new utils.BigNum(carrier.balance).add(
            new utils.BigNum(packet.assset.security)
        );
        carrier.balance = carrierBalanceWithSecurity.toString();
        store.account.set(carrier.address, carrier);
        /* --- Revert packet account --- */
        packet.asset.deliveryStatus = "pending";
        packet.asset.carrier = null;
        store.account.set(packet.address, packet);
        return errors;
    }

}

module.exports = StartTransportTransaction;

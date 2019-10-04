const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

class StartTransportTransaction extends BaseTransaction {
    // sender could send the tx, but not give the packet to the carrier. Carrier will get punished for this :(
    // advanced idea: think about trust point system for sender/receiver as well

    // Carrier should ONLY post "register-carrier", when the carrier is already at the location of the packet sender.

    static get TYPE () {
        return 23;
    }

    static get FEE () {
        //return `${10 ** 8}`;
        return '0';
    };

    async prepare(store) {
        await store.account.cache([
            {
                address: this.asset.packetId,
            },
            {
                address: this.senderId,
            }
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

    applyAsset(store) {
        const errors = [];
        const packet = store.account.get(this.asset.packetId);
        const carrier = store.account.get(this.senderId);
        // If the carrier has the trust to transport the packet
        if (packet.asset.minTrust <= carrier.asset.trust) {
            const carrierBalanceWithoutSecurity = new utils.BigNum(carrier.balance).sub(
                new utils.BigNum(packet.security)
            );
            const carrierTrust = carrier.asset.trust ? carrier.asset.trust : 0;
            const updatedCarrier = {
                ...carrier,
                balance: carrierBalanceWithoutSecurity.toString(),
                asset: {
                    lockedSecurity: packet.security,
                    trust: carrierTrust
                }
            };
            /**
             * Update the Carrier account:
             * - Lock security inside the account
             * - Remove the security form balance
             * - initialize carriertrust, if not present already
             */
            store.account.set(carrier.address, updatedCarrier);
            const updatedData = {
                asset: {
                    status: "ongoing",
                    carrier: carrier.address
                }
            };
            const newObj = {
                ...packet,
                ...updatedData
            };
            /**
             * Update the Packet account:
             * - Set status to "ongoing"
             * - set carrier to ID of the carrier
             */
            store.account.set(packet.address, newObj);
        } else {
            errors.push(
                new TransactionError(
                    'carrier has not enough trust to deliver the packet',
                    packet.asset.minTrust
                )
            );
        }
        return errors;
    }

    undoAsset(store) {
        const errors = [];
        const packet = store.account.get(this.asset.packetId);
        const carrier = store.account.get(this.asset.carrierId);
        const carrierBalanceWithSecurity = new utils.BigNum(carrier.balance).add(
            new utils.BigNum(packet.security)
        );
        const updatedCarrier = {
            ...carrier,
            balance: carrierBalanceWithSecurity.toString()
        };
        store.account.set(carrier.address, updatedCarrier);
        const updatedData = {
            asset: {
                deliveryStatus: "pending",
                carrier: null
            }
        };
        const newObj = {
            ...packet,
            ...updatedData
        };
        store.account.set(packet.address, newObj);
        return errors;
    }

}

module.exports = StartTransportTransaction;

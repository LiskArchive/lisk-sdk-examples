const {
    BaseTransaction,
    TransactionError,
    BigNum
} = require('@liskhq/lisk-transactions');

class StartTransportTransaction extends BaseTransaction {
    // owner could send the tx, but not give the packet to the carrier. Carrier will get punished for this :(
    // advanced idea: think about trust point system for owner/receiver as well

    // Carrier should ONLY post "register-carrier", when the carrier is already at the location of the packet owner.

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
                address: this.asset.carrierId,
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
        const carrier = store.account.get(this.asset.carrierId);
        if (packet.asset.minTrust <= carrier.asset.trust) {
            const carrierBalanceWithoutSecurity = new BigNum(carrier.balance).sub(
                new BigNum(packet.security)
            );
            const updatedCarrier = {
                ...carrier,
                balance: carrierBalanceWithoutSecurity.toString(),
                asset: { lockedSecurity: packet.security}
            };
            store.account.set(carrier.address, updatedCarrier);
            const updatedData = {
                asset: {
                    deliveryStatus: "ongoing"
                }
            };
            const newObj = {
                ...packet,
                ...updatedData
            };
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
        const carrierBalanceWithSecurity = new BigNum(carrier.balance).add(
            new BigNum(packet.security)
        );
        const updatedCarrier = {
            ...carrier,
            balance: carrierBalanceWithSecurity.toString()
        };
        store.account.set(carrier.address, updatedCarrier);
        const updatedData = {
            asset: {
                deliveryStatus: "pending",
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

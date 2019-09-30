const {
    transactions: { BaseTransaction },
    TransactionError, BigNum
} = require('lisk-sdk');

class StartDeliveryTransaction extends BaseTransaction {
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
        const index = newObj.asset.availableCarrier.indexOf(this.asset.carrierId);
        if (index > -1 && this.asset.deliveryStatus === "pending") {
            const carrier = store.account.get(this.asset.carrierId);
            if (packet.asset.minTrust <= carrier.asset.trust) {
                const packetBalanceWithSecurity = new BigNum(packet.balance).add(
                    new BigNum(packet.minSecurity)
                );
                const carrierBalanceWithoutSecurity = new BigNum(packet.balance).sub(
                    new BigNum(packet.minSecurity)
                );
                const updatedCarrier = {
                    ...carrier,
                    balance: carrierBalanceWithoutSecurity.toString()
                };
                store.account.set(carrier.address, updatedCarrier);
                const updatedData = {
                    asset: {
                        deliveryStatus: "ongoing",
                        activeCarrier: this.asset.carrierId,
                        balance: packetBalanceWithSecurity.toString()
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
                        packet.asset.minTrust,
                        carrier.asset.trust
                    )
                );
            }

        } else {
            errors.push(
                new TransactionError(
                    'CarrierId not found in availableCarriers list',
                    this.id,
                    '.asset.carrierId',
                    this.asset.carrierId
                )
            );
        }
        return errors;
    }

    undoAsset(store) {
        const errors = [];
        const packet = store.account.get(this.asset.packetId);
        if (packet.asset.activeCarrier === this.asset.carrierId && this.asset.deliveryStatus !== "pending") {
            const carrier = store.account.get(this.asset.carrierId);
            const packetBalanceWithoutSecurity = new BigNum(packet.balance).sub(
                new BigNum(packet.minSecurity)
            );
            const carrierBalanceWithSecurity = new BigNum(packet.balance).add(
                new BigNum(packet.minSecurity)
            );
            const updatedCarrier = {
                ...carrier,
                balance: carrierBalanceWithSecurity.toString()
            };
            store.account.set(carrier.address, updatedCarrier);
            const updatedData = {
                asset: {
                    deliveryStatus: "pending",
                    activeCarrier: null,
                    balance: packetBalanceWithoutSecurity.toString()
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
                    'CarrierId not found in activeCarrier',
                    this.id,
                    '.asset.carrierId',
                    this.asset.carrierId
                )
            );
        }
        return errors;
    }

}

module.exports = StartDeliveryTransaction;

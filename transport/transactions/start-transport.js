const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

class StartTransportTransaction extends BaseTransaction {

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
        const carrierTrust = carrier.asset.trust ? carrier.asset.trust : 0;
        if (packet.asset.minTrust <= carrierTrust) {
            /**
             * Update the Carrier account:
             * - Lock security inside the account
             * - Remove the security form balance
             * - initialize carriertrust, if not present already
             */
            const carrierBalanceWithoutSecurity = new utils.BigNum(carrier.balance).sub(
                new utils.BigNum(packet.asset.security)
            );
            const carrierTrust = carrier.asset.trust ? carrier.asset.trust : 0;
            const updatedCarrier = {
                ...carrier,
                balance: carrierBalanceWithoutSecurity.toString(),
                asset: {
                    trust: carrierTrust,
                    lockedSecurity: packet.asset.security,
                }
            };
            store.account.set(carrier.address, updatedCarrier);
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
            new utils.BigNum(packet.assset.security)
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

const {
    transactions: { BaseTransaction },
    TransactionError,
} = require('lisk-sdk');

class RegisterPacketTransaction extends BaseTransaction {

    static get TYPE () {
        return 20;
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
        const newObj = {
            ...packet,
            asset: {
                receiverId: this.asset.receiverId,
                receiverLocation: this.asset.receiverLocation,
                ownerId: this.asset.senderPublicKey,
                ownerLocation: this.asset.senderLocation,
                porto: this.asset.porto,
                minSecurity: this.asset.minSecurity,
                minTrust: this.asset.minTrust,
                estTravelTime: this.asset.estTravelTime,
                deliveryStatus: "pending",
                standbyCarrier: []
            }
        };
        store.account.set(packet.address, newObj);
        return errors; // array of TransactionErrors, returns empty array if no errors are thrown
    }

    undoAsset(store) {
        const packet = store.account.get(this.asset.packetId);
        const oldObj = { ...packet, asset: null };
        store.account.set(packet.address, oldObj);
        return [];
    }

}

module.exports = RegisterPacketTransaction;

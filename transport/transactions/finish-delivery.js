const {
    TransferTransaction,
    TransactionError
} = require('@liskhq/lisk-transactions');

class FinishDeliveryTransaction extends TransferTransaction {

    static get TYPE () {
        return 24;
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
        const index = newObj.asset.standbyCarrier.indexOf(this.asset.carrierId);
        if (index > -1 && this.asset.deliveryStatus === "pending") {
            const updatedData = {
                asset: {
                    deliveryStatus: "ongoing",
                    activeCarrier: this.asset.carrierId
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
                    'CarrierId not found in standbyCarriers list',
                    this.id,
                    '.asset.carrierId',
                    this.asset.carrierId
                )
            );
        }
        return errors;
    }

    undoAsset(store) {
        const packet = store.account.get(this.asset.packetId);
        const oldObj = { ...packet, asset: null };
        store.account.set(packet.address, oldObj);
        return [];
    }

}

module.exports = FinishDeliveryTransaction;

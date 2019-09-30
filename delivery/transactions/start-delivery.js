const {
    transactions: { BaseTransaction },
    TransactionError,
} = require('lisk-sdk');

class StartDeliveryTransaction extends TransferTransaction {

    //let carrier signs packetId, carrierPublickey and security
    // carrier sends signed object to the owner
    // owner includes carriers signature in the startDeliveryTransaction object.
    //maybe this is not the best way.. better ask science team, how to create a transaction with multiple signatures.
    // owner could send the tx, but not give the packet to the carrier. Carrier will get punished for this :(
    // Carrier should ONLY post "register-carrier", when the carrier is already at the location of the packet owner.
    /**
     * {
     *   "data": {
     *     "packetId": "abc",
     *     "carrierPublicKey": "123",
     *     "security": "100"
     *   },
     *   "signature": "b214hqjv2j3v25j"
     * }
     */
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
                    'CarrierId not found in availableCarriers list',
                    this.id,
                    '.asset.carrierId',
                    this.asset.carrierId
                )
            );
        }
        return errors; // array of TransactionErrors, returns empty array if no errors are thrown
    }

    undoAsset(store) {
        const packet = store.account.get(this.asset.packetId);
        const oldObj = { ...packet, asset: null };
        store.account.set(packet.address, oldObj);
        return [];
    }

}

module.exports = StartDeliveryTransaction;

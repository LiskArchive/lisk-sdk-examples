const {
    transactions: { BaseTransaction },
    TransactionError,
} = require('lisk-sdk');

class RegisterCarrierTransaction extends BaseTransaction {

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
        const newObj = {...packet};
        newObj.asset.availableCarrier.push(this.senderId);
        store.account.set(packet.address, newObj);
        return errors;
    }

    undoAsset(store) {
        const errors = [];
        const packet = store.account.get(this.asset.packetId);
        const newObj = {...packet};
        const index = newObj.asset.availableCarrier.indexOf(this.senderId);
        if (index > -1) {
            newObj.asset.availableCarrier.splice(index, 1);
        }
        store.account.set(packet.address, newObj);
        return errors;
    }

}

module.exports = RegisterCarrierTransaction;

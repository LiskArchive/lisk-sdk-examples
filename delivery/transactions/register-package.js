const {
    transactions: { BaseTransaction },
    TransactionError,
} = require('lisk-sdk');

class RegisterPackageTransaction extends BaseTransaction {

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
                address: this.asset.packageId,
            },
        ]);
    }

    validateAsset() {
        const errors = [];
        if (!this.asset.packageId || typeof this.asset.packageId !== 'string') {
            errors.push(
                new TransactionError(
                    'Invalid "asset.packageId" defined on transaction',
                    this.id,
                    '.asset.packageId',
                    this.asset.packageId
                )
            );
        }
        return errors;
    }

    applyAsset(store) {
        const errors = [];
        const package = store.account.get(this.asset.packageId);
        const newObj = {
            ...package,
            asset: {
                receiverId: this.asset.receiverId,
                receiverLocation: this.asset.receiverLocation,
                senderLocation: this.asset.senderLocation,
                porto: this.asset.porto,
                minSecurity: this.asset.minSecurity,
                minTrust: this.asset.minTrust,
                estTravelTime: this.asset.estTravelTime
            }
        };
        store.account.set(package.address, newObj);
        return errors; // array of TransactionErrors, returns empty array if no errors are thrown
    }

    undoAsset(store) {
        const package = store.account.get(this.asset.packageId);
        const oldObj = { ...package, asset: null };
        store.account.set(package.address, oldObj);
        return [];
    }

}

module.exports = HelloTransaction;

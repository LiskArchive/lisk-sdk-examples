const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

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
        const owner = store.account.get(this.senderId);

        const ownerBalanceWithoutPorto = new utils.BigNum(owner.balance).sub(
            new utils.BigNum(this.asset.porto)
        );
        const updatedOwner = {
            ...owner,
            balance: ownerBalanceWithoutPorto.toString()
        };
        store.account.set(owner.address, updatedOwner);
        const newObj = {
            ...packet,
            balance : this.asset.porto,
            asset: {
                receiverId: this.asset.receiverId,
                receiverLocation: this.asset.receiverLocation,
                ownerId: this.senderId,
                ownerLocation: this.asset.senderLocation,
                security: this.asset.security,
                minTrust: this.asset.minTrust,
                estTravelTime: this.asset.estTravelTime,
                deliveryStatus: "pending",
                standbyCarrier: []
            }
        };
        store.account.set(packet.address, newObj);
        return errors;
    }

    undoAsset(store) {
        const packet = store.account.get(this.asset.packetId);
        const oldObj = { ...packet, balance: 0, asset: null };
        store.account.set(packet.address, oldObj);
        const owner = store.account.get(this.senderId);
        const ownerBalanceWithPorto = new utils.BigNum(owner.balance).add(
            new utils.BigNum(this.asset.porto)
        );
        const updatedOwner = {
            ...owner,
            balance: ownerBalanceWithPorto.toString()
        };
        store.account.set(owner.address, updatedOwner);
        return [];
    }

}

module.exports = RegisterPacketTransaction;

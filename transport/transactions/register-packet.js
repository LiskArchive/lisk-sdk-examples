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
        const sender = store.account.get(this.senderId);
        const senderBalanceWithoutPorto = new utils.BigNum(sender.balance).sub(
            new utils.BigNum(this.asset.porto)
        );
        const packetBalanceWithPorto = new utils.BigNum(packet.balance).add(
            new utils.BigNum(this.asset.porto)
        );
        const updatedSender = {
            ...sender,
            balance: senderBalanceWithoutPorto.toString()
        };
        // Deduct the porto from senders' account balance
        store.account.set(sender.address, updatedSender);
        const newObj = {
            ...packet,
            balance : packetBalanceWithPorto.toString(),
            asset: {
                recipient: this.recipientId,
                sender: this.senderId,
                security: this.asset.security,
                porto: this.asset.porto,
                minTrust: this.asset.minTrust,
                status: "pending",
                carrier: null
            }
        };
        /**
         * Update the packet account:
         * - Add the porto to the packet account balance
         * - Add all important data about the packet inside the asset field:
         *   - recipient: ID of the packet recipient
         *   - sender: ID of the packet sender
         *   - carrier: ID of the packet carrier
         *   - security: Amount of tokens the carrier needs to lock during the transport of the packet
         *   - porto: the amount of tokens the sender needs to pay for transportation of the packet
         *   - minTrust: minimal trust that is needed to be carrier for the packet
         *   - status: status of the transport (pending|ongoing|success|fail)
         */
        store.account.set(packet.address, newObj);
        return errors;
    }

    undoAsset(store) {
        const packet = store.account.get(this.asset.packetId);
        const oldObj = { ...packet, balance: 0, asset: null };
        store.account.set(packet.address, oldObj);
        const sender = store.account.get(this.senderId);
        const senderBalanceWithPorto = new utils.BigNum(sender.balance).add(
            new utils.BigNum(this.asset.porto)
        );
        const updatedSender = {
            ...sender,
            balance: senderBalanceWithPorto.toString()
        };
        store.account.set(sender.address, updatedSender);
        return [];
    }

}

module.exports = RegisterPacketTransaction;

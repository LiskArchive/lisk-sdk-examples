const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

/**
 * Register new package for sender and update package account.
 */
class RegisterPacketTransaction extends BaseTransaction {

    static get TYPE () {
        return 20;
    }

    static get FEE () {
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
        // Static checks for presence of `packetId`, `porto`, `security`, and `minTrust`.
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
        if (!this.asset.porto || typeof this.asset.porto !== 'string') {
			errors.push(
				new TransactionError(
					'Invalid "asset.porto" defined on transaction',
					this.id,
					'.asset.porto',
					this.asset.porto,
					'A string value',
				)
			);
        }
        if (!this.asset.security || typeof this.asset.security !== 'string') {
			errors.push(
				new TransactionError(
					'Invalid "asset.security" defined on transaction',
					this.id,
					'.asset.security',
					this.asset.security,
					'A string value',
				)
			);
        }
        if (typeof this.asset.minTrust !== 'number' || isNaN(parseFloat(this.asset.minTrust)) || !isFinite(this.asset.minTrust)) {
			errors.push(
				new TransactionError(
					'Invalid "asset.minTrust" defined on transaction',
					this.id,
					'.asset.minTrust',
					this.asset.minTrust,
					'A number value',
				)
			);
		}
        return errors;
    }

    applyAsset(store) {
        const errors = [];
        if (packet.asset.status) {
            /* --- Modify sender account --- */
            /**
             * Update the sender account:
             * - Deduct the porto from senders' account balance
             */
            const sender = store.account.get(this.senderId);
            const senderBalancePortoDeducted = new utils.BigNum(sender.balance).sub(
                new utils.BigNum(this.asset.porto)
            );
            const updatedSender = {
                ...sender,
                balance: senderBalancePortoDeducted.toString(),
            };
            store.account.set(sender.address, updatedSender);

            /* --- Modify packet account --- */
            /**
             * Update the packet account:
             * - Add the porto to the packet account balance
             * - Add all important data about the packet inside the asset field:
             *   - recipient: ID of the packet recipient
             *   - sender: ID of the packet sender
             *   - carrier: ID of the packet carrier
             *   - security: Number of tokens the carrier needs to lock during the transport of the packet
             *   - porto: Number of tokens the sender needs to pay for transportation of the packet
             *   - minTrust: Minimal trust that is needed to be carrier for the packet
             *   - status: Status of the transport (pending|ongoing|success|fail)
             */
            const packet = store.account.get(this.asset.packetId);
            const packetBalanceWithPorto = new utils.BigNum(packet.balance).add(
                new utils.BigNum(this.asset.porto)
            );

            const updatedPacketAccount = {
                ...packet,
                ...{
                    balance: packetBalanceWithPorto.toString(),
                    asset: {
                        recipient: this.recipientId,
                        sender: this.senderId,
                        security: this.asset.security,
                        porto: this.asset.porto,
                        minTrust: this.asset.minTrust,
                        status: 'pending',
                        carrier: null
                    }
                }
            };
            store.account.set(packet.address, updatedPacketAccount);
        } else {
            errors.push(
                new TransactionError(
                    'packet has already been registered',
                    packet.asset.status
                )
            );
        }
        return errors;
    }

    undoAsset(store) {
        const errors = [];

        /* --- Revert packet account --- */
        const packet = store.account.get(this.asset.packetId);
        const originalPacketAccount = { ...packet, balance: 0, asset: null };
        store.account.set(packet.address, originalPacketAccount);

        /* --- Revert sender account --- */
        const sender = store.account.get(this.senderId);
        const senderBalanceWithPorto = new utils.BigNum(sender.balance).add(
            new utils.BigNum(this.asset.porto)
        );
        const updatedSender = {
            ...sender,
            balance: senderBalanceWithPorto.toString()
        };
        store.account.set(sender.address, updatedSender);
        return errors;
    }

}

module.exports = RegisterPacketTransaction;

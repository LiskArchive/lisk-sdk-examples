/*
 * Copyright © 2020 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */
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
        // Static checks for presence of `packetId`, `postage`, `security`, and `minTrust`.
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
        if (!this.asset.postage || typeof this.asset.postage !== 'string') {
			errors.push(
				new TransactionError(
					'Invalid "asset.postage" defined on transaction',
					this.id,
					'.asset.postage',
					this.asset.postage,
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
        const packet = store.account.get(this.asset.packetId);

        if (!packet.asset.status) {
            /* --- Modify sender account --- */
            /**
             * Update the sender account:
             * - Deduct the postage from senders' account balance
             */
            const sender = store.account.get(this.senderId);
            const senderBalancePostageDeducted = new utils.BigNum(sender.balance).sub(
                new utils.BigNum(this.asset.postage)
            );
            const updatedSender = {
                ...sender,
                balance: senderBalancePostageDeducted.toString(),
            };
            store.account.set(sender.address, updatedSender);

            /* --- Modify packet account --- */
            /**
             * Update the packet account:
             * - Add the postage to the packet account balance
             * - Add all important data about the packet inside the asset field:
             *   - recipient: ID of the packet recipient
             *   - sender: ID of the packet sender
             *   - carrier: ID of the packet carrier
             *   - security: Number of tokens the carrier needs to lock during the transport of the packet
             *   - postage: Number of tokens the sender needs to pay for transportation of the packet
             *   - minTrust: Minimal trust that is needed to be carrier for the packet
             *   - status: Status of the transport (pending|ongoing|success|fail)
             */
            const packetBalanceWithPostage = new utils.BigNum(packet.balance).add(
                new utils.BigNum(this.asset.postage)
            );

            const updatedPacketAccount = {
                ...packet,
                ...{
                    balance: packetBalanceWithPostage.toString(),
                    asset: {
                        recipient: this.asset.recipientId,
                        sender: this.senderId,
                        security: this.asset.security,
                        postage: this.asset.postage,
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

        /* --- Revert sender account --- */
        const sender = store.account.get(this.senderId);
        const senderBalanceWithPostage = new utils.BigNum(sender.balance).add(
            new utils.BigNum(this.asset.postage)
        );
        const updatedSender = {
            ...sender,
            balance: senderBalanceWithPostage.toString()
        };
        store.account.set(sender.address, updatedSender);

        /* --- Revert packet account --- */
        const packet = store.account.get(this.asset.packetId);
        const originalPacketAccount = { ...packet, balance: 0, asset: null };
        store.account.set(packet.address, originalPacketAccount);

        return errors;
    }

}

module.exports = RegisterPacketTransaction;

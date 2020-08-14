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
    TransactionError
} = require('@liskhq/lisk-transactions');

class HelloTransaction extends BaseTransaction {

	static get TYPE () {
		return 20;
	};

	static get FEE () {
		return `${10 ** 8}`;
	};

	async prepare(store) {
		await store.account.cache([
			{
				address: this.senderId,
			},
		]);
	}

	validateAsset() {
		const errors = [];
		if (!this.asset.hello || typeof this.asset.hello !== 'string' || this.asset.hello.length > 64) {
			errors.push(
				new TransactionError(
					'Invalid "asset.hello" defined on transaction',
					this.id,
					'.asset.hello',
					this.asset.hello,
					'A string value no longer than 64 characters',
				)
			);
		}
		return errors;
	}

	async applyAsset(store) {
        const errors = [];
        const sender = await store.account.get(this.senderId);
        if (sender.asset && sender.asset.hello) {
            errors.push(
                new TransactionError(
                    'You cannot send a hello transaction multiple times',
	                sender.asset.hello,
                    '.asset.hello',
                    this.asset.hello
                )
            );
        } else {
	        sender.asset = { hello: this.asset.hello };
            store.account.set(sender.address, sender);
        }
        return errors; // array of TransactionErrors, returns empty array if no errors are thrown
	}

	undoAsset(store) {
		const sender = store.account.get(this.senderId);
		sender.asset = null;
		store.account.set(sender.address, sender);
		return [];
	}
}

module.exports = HelloTransaction;

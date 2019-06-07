const {
	BaseTransaction,
	TransactionError,
} = require('lisk-sdk');

class HelloTransaction extends BaseTransaction {

	static get TYPE () {
		return 10;
	}

	applyAsset(store) {
        const errors = [];
        const sender = store.account.get(this.senderId);
        const newObj = { ...sender, asset: { hello: this.asset.hello } };
        store.account.set(sender.address, newObj);
        return [];
        if (sender.asset && sender.asset.hello) {
            errors.push(
                new TransactionError(
                    'You cannot send a hello transaction multiple times',
                    this.id,
                    '.asset.hello',
                    this.amount.toString()
                )
            );
        } else {
            const newObj = { ...sender, asset: { hello: this.asset.hello } };
            store.account.set(sender.address, newObj);
        }
        return errors; // array of TransactionErrors, returns empty array if no errors are thrown
	}

	undoAsset(store) {
		const sender = store.account.get(this.senderId);
		const oldObj = { ...sender, asset: null };
		store.account.set(sender.address, oldObj);
		return [];
	}

	validateAsset() {
		const errors = [];
		// Consider advanced way of validating assets with validator
		// validator.validate(assetFormatSchema, this.asset);
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
	// Server
	async prepare(store) {
		await store.account.cache([
			{
				address: this.senderId,
			},
		]);
	}

}

module.exports = HelloTransaction;

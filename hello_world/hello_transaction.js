const {
	BaseTransaction,
	TransactionError,
} = require('@liskhq/lisk-transactions');
// const { validator } = require('@liskhq/lisk-validator');


const HELLO_TRANSACTION_TYPE = 10;

// const assetFormatSchema = {
// 	type: 'object',
// 	properties: {
// 		hello: {
// 			type: 'string',
// 			maxLength: 64,
// 		},
// 	},
// };

class CashbackTransaction extends BaseTransaction {

	constructor(rawTransaction) {
		super(rawTransaction);
		const tx = (typeof rawTransaction === 'object' && rawTransaction !== null
			? rawTransaction
			: {});
		this.asset = (tx.asset || {});
	}

	assetToJSON() {
		return this.asset;
	}

	//Client + Server
	applyAsset(store) {
		const sender = store.account.get(this.senderId);
		// ToDo: Open up a bug about asset = null by default instead of {}
		// sender.asset = {
		// 	hello: this.asset.hello,
		// };
		console.log(`Setting sender.asset: ${sender.asset} to transaction.asset ${this.asset}`)
		// sender.asset = {
		// 	hello: this.asset.hello,
		// };
		const newObj = { ...sender, asset: { hello: this.asset.hello } };
		store.account.set(sender.address, newObj);
		return [];
	}

	//Client + Server
	undoAsset(store) {
		const sender = store.account.get(this.senderId);
		sender.asset = null;
		store.account.set(sender.address, sender);
		return [];
	}

	//Client + Server
	assetToBytes() {
		const assetAsBuffer = Buffer.from(this.asset.hello);
		// console.log(assetAsBuffer);
		return assetAsBuffer;
	}

	//Client + Server
	validateAsset() {
		const errors = [];

		if (this.type !== HELLO_TRANSACTION_TYPE) {
			errors.push(
				new TransactionError(
					'Invalid type',
					this.id,
					'.type',
					this.type,
					HELLO_TRANSACTION_TYPE,
				),
			);
		}

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

	//Server
	async prepare(store) {
		await store.account.cache([
			{
				address: this.senderId,
			},
		]);
	}

}

module.exports = CashbackTransaction;

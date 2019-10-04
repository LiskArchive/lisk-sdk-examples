const { BaseTransaction, TransactionError } = require('@liskhq/lisk-transactions');

class InvoiceTransaction extends BaseTransaction {
	static get TYPE() {
		return 13;
	}

	static get FEE() {
		return `${10 ** 8}`;
	}

	async prepare(store) {
		await super.prepare(store); // To be replaced
	}

	validateAsset() {
		const errors = [];
		if (!this.asset.client || typeof this.asset.client !== 'string') {
			errors.push(
				new TransactionError(
					'Invalid "asset.client" defined on transaction',
					this.id,
					'.asset.client',
					this.asset.client,
					'A string value',
				)
			);
		}
		if (!this.asset.requestedAmount || typeof this.asset.requestedAmount !== 'string') {
			errors.push(
				new TransactionError(
					'Invalid "asset.requestedAmount" defined on transaction',
					this.id,
					'.asset.requestedAmount',
					this.asset.requestedAmount,
					'A string value',
				)
			);
		}
		if (!this.asset.description || typeof this.asset.description !== 'string') {
			errors.push(
				new TransactionError(
					'Invalid "asset.description" defined on transaction',
					this.id,
					'.asset.description',
					this.asset.description,
					'A string value',
				)
			);
		}
		return errors;
	}

	applyAsset(store) {
		const sender = store.account.get(this.senderId);

		// Save invoice count and IDs
		sender.asset.invoiceCount = sender.asset.invoiceCount === undefined ? 1 : ++sender.asset.invoiceCount;
		sender.asset.invoicesSent = sender.asset.invoicesSent === undefined ? [this.id] : [...sender.asset.invoicesSent, this.id];
		store.account.set(sender.address, sender);
		return [];
	}

	undoAsset(store) {
		// @TODO remove
		const sender = store.account.get(this.senderId);

		// Rollback invoice count and IDs
		sender.asset.invoiceCount = sender.asset.invoiceCount === 1 ? undefined : --sender.asset.invoiceCount;
		sender.asset.invoicesSent = sender.asset.invoicesSent.length === 1 ? undefined : sender.asset.invoicesSent.splice(
			sender.asset.invoicesSent.indexOf(this.id),
			1,
		);
		store.account.set(sender.address, sender);
		return [];
	}

}

module.exports = InvoiceTransaction;

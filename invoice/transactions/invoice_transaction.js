const {	BaseTransaction, TransactionError } = require('@liskhq/lisk-transactions');

class InvoiceTransaction extends BaseTransaction {

	static get TYPE () {
		return 13;
	}

	async prepare(store) {
		await store.account.cache([
			{
				address: this.senderId,
			},
		]);
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
					'A number value',
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

		// Using JSON.stringify/parse to recursively clones the object
		const updatedSender = JSON.parse(JSON.stringify(sender));

		// Save invoice count and IDs
		updatedSender.asset.invoiceCount = updatedSender.asset.invoiceCount === undefined ? 0 : updatedSender.asset.invoiceCount++;
		updatedSender.asset.invoicesSent = updatedSender.asset.invoicesSent === undefined ? [this.id] : [...updatedSender.asset.invoicesSent, this.id];
		store.account.set(sender.address, updatedSender);
		return [];
	}

	undoAsset(store) {
		const sender = store.account.get(this.senderId);

		// Using JSON.stringify/parse to recursively clones the object
		const originalSender = JSON.parse(JSON.stringify(sender));

		// Rollback invoice count and IDs
		originalSender.asset.invoiceCount = originalSender.asset.invoiceCount === 0 ? undefined : originalSender.asset.invoiceCount--;
		originalSender.asset.invoicesSent = originalSender.asset.invoicesSent.splice(
			originalSender.asset.invoicesSent.indexOf(this.id),
			1,
		);
		store.account.set(sender.address, originalSender);
		return [];
	}

}

module.exports = InvoiceTransaction;

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
		if (!this.asset.requestedAmount || typeof this.asset.requestedAmount !== 'number') {
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
		const updatedSender = { ...sender, };

		// Save invoice count and IDs
		updatedSender.asset.invoiceCount = updatedSender.asset.invoiceCount === null ? 0 : updatedSender.asset.invoiceCount++;
		updatedSender.asset.sentInvoices = updatedSender.asset.sentInvoices === null ? [this.id] : [...updatedSender.asset.sentInvoices, this.id];
		store.account.set(sender.address, updatedSender);
		return [];
	}

	undoAsset(store) {
		const sender = store.account.get(this.senderId);
		const originalSender = { ...sender, };

		// Rollback invoice count and IDs
		originalSender.asset.invoiceCount = originalSender.asset.invoiceCount === 0 ? null : originalSender.asset.invoiceCount--;
		originalSender.asset.sentInvoices = originalSender.asset.sentInvoices.splice(
			originalSender.asset.sentInvoices.indexOf(this.id),
			1,
		);
		store.account.set(sender.address, originalSender);
		return [];
	}

}

module.exports = InvoiceTransaction;
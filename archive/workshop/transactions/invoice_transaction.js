const {
	BaseTransaction,
	TransactionError,
} = require('@liskhq/lisk-transactions');

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
				),
			);
		}
		if (
			!this.asset.requestedAmount ||
			typeof this.asset.requestedAmount !== 'string'
		) {
			errors.push(
				new TransactionError(
					'Invalid "asset.requestedAmount" defined on transaction',
					this.id,
					'.asset.requestedAmount',
					this.asset.requestedAmount,
					'A string value',
				),
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
				),
			);
		}
		return errors;
	}

	applyAsset(store) {
		const sender = store.account.get(this.senderId);

		// Save invoice count and IDs
		if (!sender.asset.invoiceCount) {
			sender.asset.invoiceCount = 0;
		}

		if (!sender.asset.invoicesSent) {
			sender.asset.invoicesSent = [];
		}

		sender.asset.invoiceCount++;
		sender.asset.invoicesSent.push(this.id);

		store.account.set(sender.address, sender);
		return [];
	}

	undoAsset(store) {
		const errors = [];
		const sender = {}; // Step 4.1 retrieve sender from store (replace code)
		const invoiceId = sender.asset.invoicesSent.find(id => id === this.id);

		if (invoiceId === undefined || sender.asset.invoiceCount === 0) {
			errors.push(
				new TransactionError(
					'Invoice ID does not exist in sender.asset.invoicesSent',
					this.id,
					'sender.asset.invoicesSent',
					sender.asset.invoicesSent,
					'A string value',
				),
			);
		} else {
			// Step 4.2 and 4.3: Undo logic comes here
			// Step 4.4: Save updated sender account
		}

		return errors;
	}
}

module.exports = InvoiceTransaction;

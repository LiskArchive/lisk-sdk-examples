const {
	TransferTransaction,
	TransactionError,
} = require('@liskhq/lisk-transactions');

class PaymentTransaction extends TransferTransaction {
	static get TYPE() {
		return 14;
	}

	async prepare(store) {
		await super.prepare(store); // To be replaced (step 1 & 2)
	}

	applyAsset(store) {
		// Need to call super here to get validation errors from validation logic in applyAsset function of TransferTransaction
		const errors = super.applyAsset(store);

		// Code step 3 comes here

		// Code step 4 comes below here
		if (transaction) {
			// if transaction found in step 3 -> start validation
		} else {
			// Return TransactionError if tx doesn't exist
		}

		return errors;
	}

	undoAsset(store) {
		const errors = super.undoAsset(store); // Needs to be called for validation errors

		// Potential code step 5 comes here

		return errors;
	}
}

module.exports = PaymentTransaction;

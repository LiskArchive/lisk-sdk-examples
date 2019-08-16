const { TransferTransaction, TransactionError } = require('@liskhq/lisk-transactions');

class PaymentTransaction extends TransferTransaction {
	static get TYPE () {
		return 14;
	}

	async prepare(store) {
		await super.prepare(store);
		await store.transaction.cache([
			{
				id: this.asset.data,
			},
		]);
	 }

	applyAsset(store) {
		const errors = super.applyAsset(store);

		const transaction = store.transaction.find(
			transaction => transaction.id === this.asset.data
		); // Find related invoice in transactions for invoiceID

		if (!transaction) {
            errors.push( new TransactionError(
					'Invoice does not exist for ID',
					this.id,
					'.asset.invoiceID',
					this.asset.data,
					'Existing invoiceID registered as invoice transaction',
				));
		}
        if (this.amount.lt(transaction.asset.requestedAmount)) {
            errors.push( new TransactionError(
                'Paid amount is lower than amount stated on invoice',
                this.id,
                '.amount',
                transaction.requestedAmount,
                'Expected amount to be equal or greated than `requestedAmount`',
            ));
        }
        this.recipientId = transaction.senderId;
        return errors;
	}

	undoAsset(store) {
		// No rollback needed as there is only validation happening in applyAsset
		// Higher level function will rollback the attempted payment (send back tokens)

		const errors = super.undoAsset(store);

		return errors;
	}

}

module.exports = PaymentTransaction;

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
		const transaction = store.transaction.find(
			transaction => transaction.id === this.asset.data
		); // Find related invoice in transactions for invoiceID

		if (!transaction) {
            return [ new TransactionError(
					'Invoice does not exist for ID',
					this.id,
					'.asset.invoiceID',
					this.asset.data,
					'Existing invoiceID registered as invoice transaction',
				) ];
		}
        if (this.amount.lt(transaction.asset.requestedAmount)) {
            return [ new TransactionError(
                'Paid amount is lower than amount stated on invoice',
                this.id,
                '.amount',
                transaction.requestedAmount,
                'Expected amount to be equal or greated than `requestedAmount`',
            )];
        }
        this.recipientId = transaction.senderId;
        super.applyAsset(store);
        return [];
	}

	undoAsset(store) {
		// No rollback needed as there is only validation happening in applyAsset
		// Higher level function will rollback the attempted payment (send back tokens)
		super.undoAsset(store);

		return [];
	}

}

module.exports = PaymentTransaction;

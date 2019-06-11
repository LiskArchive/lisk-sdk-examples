const {	TransferTransaction, BigNum } = require('lisk-sdk');
const { TransactionError } = require('@liskhq/lisk-transactions');
class PaymentTransaction extends TransferTransaction {

	static get TYPE () {
		return 14;
	}

	applyAsset(store) {
		super.applyAsset(store);
		const errors = [];
		const transaction = store.transaction.find(
			transaction => transaction.id === this.asset.invoiceID
		); // Find related invoice in transactions for invoiceID

		if (!transaction) {
			errors.push(
				new TransactionError(
					'Invoice does not exist for ID',
					this.id,
					'.asset.invoiceID',
					this.asset.invoiceID,
					'Existing invoiceID registered as invoice transaction',
				)
			);
		}

		if (this.amount < transaction.asset.requestedAmount) {
			errors.push(
				new TransactionError(
					'Paid amount is lower than amount stated on invoice',
					this.id,
					'.amount',
					transaction.requestedAmount,
					'Expected amount to be equal or greated than `requestedAmount`',
				)
			);
		}

		return errors;
	}

	undoAsset(store) {
		// No rollback needed as there is only validation happening in applyAsset
		// Higher level function will rollback the attempted payment (send back LSK tokens)
		super.undoAsset(store); 
	
		return [];
	}

}

module.exports = PaymentTransaction;

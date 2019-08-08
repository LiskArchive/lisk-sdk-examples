const {
	transactions: { TransferTransaction },
	BigNum,
} = require('lisk-sdk');


class CashbackTransaction extends TransferTransaction {

	static get TYPE () {
		return 11;
	};

	static get FEE () {
		return `${10 ** 7}`;
	};

	applyAsset(store) {
		const errors = super.applyAsset(store);

		const sender = store.account.get(this.senderId);
		const updatedSenderBalanceAfterBonus = new BigNum(sender.balance).add(
			new BigNum(this.amount).div(10)
		);
		const updatedSender = {
			...sender,
			balance: updatedSenderBalanceAfterBonus.toString(),
		};
		store.account.set(sender.address, updatedSender);

		return errors;
	}

	undoAsset(store) {
		const errors = super.undoAsset(store);

		const sender = store.account.get(this.senderId);
		const updatedSenderBalanceAfterBonus = new BigNum(sender.balance).sub(
			new BigNum(this.amount).div(10)
		);
		const updatedSender = {
			...sender,
			balance: updatedSenderBalanceAfterBonus.toString(),
		};
		store.account.set(sender.address, updatedSender);

		return errors;
	}
}

module.exports = CashbackTransaction;

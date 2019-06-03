const {
	TransferTransaction,
	BigNum,
} = require('lisk-sdk');


class CashbackTransaction extends TransferTransaction {

	static get TYPE () {
		return 11;
	}

	applyAsset(store) {
		super.applyAsset(store);

		const sender = store.account.get(this.senderId);
		const updatedSenderBalanceAfterBonus = new BigNum(sender.balance).add(
			new BigNum(this.amount).div(10)
		);
		const updatedSender = {
			...sender,
			balance: updatedSenderBalanceAfterBonus.toString(),
		};
		store.account.set(sender.address, updatedSender);

		return [];
	}

	undoAsset(store) {
		super.applyAsset(store);

		const sender = store.account.get(this.senderId);
		const updatedSenderBalanceAfterBonus = new BigNum(sender.balance).sub(
			new BigNum(this.amount).div(10)
		);
		const updatedSender = {
			...sender,
			balance: updatedSenderBalanceAfterBonus.toString(),
		};
		store.account.set(sender.address, updatedSender);

		return [];
	}
}

module.exports = CashbackTransaction;

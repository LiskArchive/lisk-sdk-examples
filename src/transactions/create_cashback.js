const { getAddressFromPublicKey } = require('@liskhq/lisk-cryptography');
const { 	
	BYTESIZES,
    constants,
	TransferTransaction,
	utils 
} = require('@liskhq/lisk-transactions');

const validateInputs = ({
	amount,
	recipientId,
	recipientPublicKey,
	data,
}) => {
	if (!utils.validateTransferAmount(amount)) {
		throw new Error('Amount must be a valid number in string format.');
	}

	if (!recipientId && !recipientPublicKey) {
		throw new Error(
			'Either recipientId or recipientPublicKey must be provided.',
		);
	}

	if (typeof recipientId !== 'undefined') {
		utils.validateAddress(recipientId);
	}

	if (typeof recipientPublicKey !== 'undefined') {
		utils.validatePublicKey(recipientPublicKey);
	}

	if (
		recipientId &&
		recipientPublicKey &&
		recipientId !== getAddressFromPublicKey(recipientPublicKey)
	) {
		throw new Error('recipientId does not match recipientPublicKey.');
	}

	if (data && data.length > 0) {
		if (typeof data !== 'string') {
			throw new Error(
				'Invalid encoding in transaction data. Data must be utf-8 encoded string.',
			);
		}
		if (data.length > BYTESIZES.DATA) {
			throw new Error('Transaction data field cannot exceed 64 bytes.');
		}
	}
};

// eslint-disable-next-line
module.exports = (inputs) => {
	validateInputs(inputs);
	const {
		data,
		amount,
		recipientPublicKey,
		passphrase,
		secondPassphrase,
	} = inputs;

	const recipientIdFromPublicKey = recipientPublicKey
		? utils.getAddressFromPublicKey(recipientPublicKey)
		: undefined;
	const recipientId = inputs.recipientId
		? inputs.recipientId
		: recipientIdFromPublicKey;

	const transaction = {
		// TODO: This is not exposed by default..
		...utils.createBaseTransaction(inputs),
		asset: data ? { data } : {},
		amount,
		fee: constants.TRANSFER_FEE.toString(),
		recipientId,
		recipientPublicKey,
		type: 9,
	};

	if (!passphrase) {
		return transaction;
	}

	const transactionWithSenderInfo = {
		...transaction,
		recipientId,
		senderId: transaction.senderId,
		senderPublicKey: transaction.senderPublicKey,
	};

	const transferTransaction = new TransferTransaction(
		transactionWithSenderInfo,
    );
    transferTransaction.sign(passphrase, secondPassphrase);

	return transferTransaction.toJSON();
};

const { validateTransferAmount, validateAddress, validatePublicKey } = require('@liskhq/lisk-validator');
const { getAddressFromPublicKey } = require('@liskhq/lisk-cryptography');
const {
	BYTESIZES,
	TransferTransaction,
} = require('@liskhq/lisk-transactions');

const validateInputs = ({
	amount,
	recipientId,
    recipientPublicKey,
    senderPublicKey,
	data,
}) => {
	if (!validateTransferAmount(amount)) {
		throw new Error('Amount must be a valid number in string format.');
	}

	if (!recipientId && !recipientPublicKey) {
		throw new Error(
			'Either recipientId or recipientPublicKey must be provided.',
		);
	}

	if (typeof recipientId !== 'undefined') {
		validateAddress(recipientId);
	}

	if (typeof senderPublicKey !== 'undefined') {
		validatePublicKey(senderPublicKey);
	}

	if (typeof recipientPublicKey !== 'undefined') {
		validatePublicKey(recipientPublicKey);
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
		fee,
		type,
		recipientId,
		recipientPublicKey,
		senderPublicKey,
		passphrase,
		secondPassphrase,
		timestamp,
	} = inputs;

	inputs.timestamp = inputs.timestamp || 0;
	const recipientIdFromPublicKey = recipientPublicKey
		? getAddressFromPublicKey(recipientPublicKey)
		: undefined;

	inputs.recipientId = recipientIdFromPublicKey
		? recipientIdFromPublicKey
		: inputs.recipientId;


	if (!passphrase) {
		throw "Cannot sign a transaction without a passphrase. Specify your passphrase as in the input object (and optional second passphrase)";
	}

	const transferTransaction = new TransferTransaction(
		{
			asset: data ? { data } : {},
			amount,
			fee,
			recipientId,
			senderPublicKey,
			type,
			timestamp,
		}
    );
    transferTransaction.sign(passphrase, secondPassphrase);

	return asJSON(skipUndefined(transferTransaction.toJSON()));
};

function asJSON (transaction) {
	return JSON.stringify(transaction);
}

function skipUndefined (transaction) {
	return Object.keys(transaction).reduce((transactionWithValues, property) => {
		if (transaction[property] !== undefined) {
			transactionWithValues[property] = transaction[property];
		}
		return transactionWithValues;
	}, {});
}

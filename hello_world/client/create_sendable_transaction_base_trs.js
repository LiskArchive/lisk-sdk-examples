const { validateAddress, validatePublicKey } = require('@liskhq/lisk-validator');
const { getAddressFromPublicKey } = require('@liskhq/lisk-cryptography');

const validateRequiredInputs = ({
                                    recipientId,
                                    recipientPublicKey,
                                    senderPublicKey,
                                    type,
                                }) => {

    if (!(recipientId || recipientPublicKey)) {
        throw new Error(
            'Either recipientId or recipientPublicKey must be provided.',
        );
    }

    if (typeof recipientId !== 'undefined') {
        validateAddress(recipientId);
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

    if (!senderPublicKey) {
        throw new Error(
            'senderPublicKey must be provided.',
        );
    }

    if (typeof senderPublicKey !== 'undefined') {
        validatePublicKey(senderPublicKey);
    }


    if (!type || typeof type !== 'number') {
        throw new Error(
            'type must be provided.',
        );
    }
};

// eslint-disable-next-line
module.exports = (Transaction, inputs) => {
    validateRequiredInputs(inputs);
    const {
        data,
        amount,
        asset,
        fee,
        type,
        recipientId,
        recipientPublicKey,
        senderPublicKey,
        passphrase,
        secondPassphrase,
        timestamp,
    } = inputs;

    inputs.asset = asset || {};
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

    const transaction = new Transaction(
        {
            asset: data ? { data } : asset,
            amount,
            fee,
            recipientId,
            senderPublicKey,
            type,
            timestamp,
        }
    );

    transaction.sign(passphrase, secondPassphrase);

    return asJSON(skipUndefined(transaction.toJSON()));
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

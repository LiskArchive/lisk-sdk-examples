const { ED25519_PUBLIC_KEY_LENGTH, ED25519_SIGNATURE_LENGTH, ADDRESS_LENGTH, TOKEN_ID_LENGTH, MAX_DATA_LENGTH } = require('./constants');

const registerMultisignatureParamsSchema = {
    $id: '/auth/command/regMultisig',
    type: 'object',
    properties: {
        numberOfSignatures: {
            dataType: 'uint32',
            fieldNumber: 1,
            minimum: 1,
            maximum: 64,
        },
        mandatoryKeys: {
            type: 'array',
            items: {
                dataType: 'bytes',
                minLength: ED25519_PUBLIC_KEY_LENGTH,
                maxLength: ED25519_PUBLIC_KEY_LENGTH,
            },
            fieldNumber: 2,
            minItems: 0,
            maxItems: 64,
        },
        optionalKeys: {
            type: 'array',
            items: {
                dataType: 'bytes',
                minLength: ED25519_PUBLIC_KEY_LENGTH,
                maxLength: ED25519_PUBLIC_KEY_LENGTH,
            },
            fieldNumber: 3,
            minItems: 0,
            maxItems: 64,
        },
        signatures: {
            type: 'array',
            items: {
                dataType: 'bytes',
                minLength: ED25519_SIGNATURE_LENGTH,
                maxLength: ED25519_SIGNATURE_LENGTH,
            },
            fieldNumber: 4,
        },
    },
    required: ['numberOfSignatures', 'mandatoryKeys', 'optionalKeys', 'signatures'],
};

const multisigRegMsgSchema = {
    $id: '/auth/command/regMultisigMsg',
    type: 'object',
    required: ['address', 'nonce', 'numberOfSignatures', 'mandatoryKeys', 'optionalKeys'],
    properties: {
        address: {
            dataType: 'bytes',
            fieldNumber: 1,
            minLength: ADDRESS_LENGTH,
            maxLength: ADDRESS_LENGTH,
        },
        nonce: {
            dataType: 'uint64',
            fieldNumber: 2,
        },
        numberOfSignatures: {
            dataType: 'uint32',
            fieldNumber: 3,
        },
        mandatoryKeys: {
            type: 'array',
            items: {
                dataType: 'bytes',
                minLength: ED25519_PUBLIC_KEY_LENGTH,
                maxLength: ED25519_PUBLIC_KEY_LENGTH,
            },
            fieldNumber: 4,
        },
        optionalKeys: {
            type: 'array',
            items: {
                dataType: 'bytes',
                minLength: ED25519_PUBLIC_KEY_LENGTH,
                maxLength: ED25519_PUBLIC_KEY_LENGTH,
            },
            fieldNumber: 5,
        },
    },
};


const transferParamsSchema = {
    /** The unique identifier of the schema. */
    $id: '/lisk/transferParams',
    /** Schema title */
    title: 'Transfer transaction params',
    type: 'object',
    /** The required parameters for the command. */
    required: ['tokenID', 'amount', 'recipientAddress', 'data'],
    /** A list describing the available parameters for the command. */
    properties: {
        /**
         * ID of the tokens being transferred.
         * `minLength` and `maxLength` are {@link TOKEN_ID_LENGTH}.
         */
        tokenID: {
            dataType: 'bytes',
            fieldNumber: 1,
            minLength: TOKEN_ID_LENGTH,
            maxLength: TOKEN_ID_LENGTH,
        },
        /** Amount of tokens to be transferred in Beddows. */
        amount: {
            dataType: 'uint64',
            fieldNumber: 2,
        },
        /** Address of the recipient. */
        recipientAddress: {
            dataType: 'bytes',
            fieldNumber: 3,
            format: 'lisk32',
        },
        /** Optional field for data / messages.
         *
         * `maxLength` is {@link MAX_DATA_LENGTH}.
         * */
        data: {
            dataType: 'string',
            fieldNumber: 4,
            minLength: 0,
            maxLength: MAX_DATA_LENGTH,
        },
    },
};

module.exports = { registerMultisignatureParamsSchema, multisigRegMsgSchema, transferParamsSchema };
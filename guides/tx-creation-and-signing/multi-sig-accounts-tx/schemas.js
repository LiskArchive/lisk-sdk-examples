const { ED25519_PUBLIC_KEY_LENGTH, ED25519_SIGNATURE_LENGTH, ADDRESS_LENGTH } = require('./constants');

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

module.exports = { registerMultisignatureParamsSchema, multisigRegMsgSchema };
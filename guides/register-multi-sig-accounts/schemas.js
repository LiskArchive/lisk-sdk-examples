const { ED25519_PUBLIC_KEY_LENGTH, ED25519_SIGNATURE_LENGTH, TOKEN_ID_LENGTH, MAX_DATA_LENGTH } = require('./constants');

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

module.exports = { registerMultisignatureParamsSchema };
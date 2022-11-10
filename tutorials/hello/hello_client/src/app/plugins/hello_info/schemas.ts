export const configSchema = {
    $id: '#/plugins/helloInfo/config',
    type: 'object',
    properties: {
        enablePlugin: {
            type: 'boolean',
        },
    },
    required: ['enablePlugin'],
    default: {
        enablePlugin: true,
    },
};
export const addressSchema = {
    $id: '/helloInfo/address',
    type: 'object',
    required: ['lskAddress', 'byteAddress'],
    properties: {
        lskAddress: {
            dataType: 'string',
            fieldNumber: 1,
        },
        byteAddress: {
            dataType: 'bytes',
            fieldNumber: 2,
        },
    },
};

export const counterSchema = {
    $id: '/helloInfo/counter',
    type: 'object',
    required: ['counter'],
    properties: {
        counter: {
            dataType: 'uint32',
            fieldNumber: 1,
        },
    },
};
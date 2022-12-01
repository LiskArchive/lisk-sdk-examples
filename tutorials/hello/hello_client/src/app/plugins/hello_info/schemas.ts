export const configSchema = {
    $id: '/plugins/helloInfo/config',
    type: 'object',
    properties: {
        syncInterval: {
            type: 'integer',
        },
    },
    required: ['syncInterval'],
    default: {
        syncInterval: 120000, // milliseconds
    },
};

export const onChainEventSchema = {
    $id: '/helloInfo/newHello/chainEvent',
    type: 'object',
    required: ['senderAddress', 'message'],
    properties: {
        senderAddress: {
            dataType: 'bytes',
            fieldNumber: 1,
        },
        message: {
            dataType: 'string',
            fieldNumber: 2,
        },
    },
};

export const offChainEventSchema = {
    $id: '/helloInfo/newHello',
    type: 'object',
    required: ['senderAddress', 'message', 'height'],
    properties: {
        senderAddress: {
            dataType: 'bytes',
            fieldNumber: 1,
        },
        message: {
            dataType: 'string',
            fieldNumber: 2,
        },
        height: {
            dataType: 'uint32',
            fieldNumber: 3,
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

export const heightSchema = {
    $id: '/helloInfo/height',
    type: 'object',
    required: ['height'],
    properties: {
        height: {
            dataType: 'uint32',
            fieldNumber: 1,
        },
    },
};
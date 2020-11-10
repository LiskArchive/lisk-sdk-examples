const CHAIN_STATE_HELLO_COUNTER = "hello:helloCounter";

const helloCounterSchema = {
    $id: "lisk/hello/counter",
    type: "object",
    required: ["helloCounter"],
    properties: {
        helloCounter: {
            dataType: "uint32",
            fieldNumber: 1,
        },
    },
};

const baseAssetSchema = {
  $id: 'lisk/base-transaction',
  type: 'object',
  required: ['moduleID', 'assetID', 'nonce', 'fee', 'senderPublicKey', 'asset'],
  properties: {
    moduleID: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    assetID: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    nonce: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    fee: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
    senderPublicKey: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    asset: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    signatures: {
      type: 'array',
      items: {
        dataType: 'bytes',
      },
      fieldNumber: 7,
    },
  },
};

const newHelloSchema = {
  $id: "lisk/hello/new",
  type: "object",
  required: ["data"],
  properties: {
    data: {
      type: "object",
      fieldNumber: 1,
      properties: {
        sender: {
          dataType: "string",
          fieldNumber: 1,
        },
        asset: {
          dataType: "string",
          fieldNumber: 2,
        },
      }
    }
  },
};

const getFullAssetSchema = assetSchema => objects.mergeDeep({}, baseAssetSchema, { properties: { asset: assetSchema },});


module.exports = {
    CHAIN_STATE_HELLO_COUNTER,
    helloCounterSchema,
    newHelloSchema
};

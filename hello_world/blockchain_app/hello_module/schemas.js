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

const helloAssetSchema = {
  $id: "lisk/hello/new",
  type: "object",
  required: ["helloString"],
  properties: {
    helloString: {
      dataType: "string",
      fieldNumber: 1,
    },
  },
};

/*export const keysSchema = {
  $id: 'lisk/keys/register',
  type: 'object',
  required: ['numberOfSignatures', 'optionalKeys', 'mandatoryKeys'],
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
        minLength: 32,
        maxLength: 32,
      },
      fieldNumber: 2,
      minItems: 0,
      maxItems: 64,
    },
    optionalKeys: {
      type: 'array',
      items: {
        dataType: 'bytes',
        minLength: 32,
        maxLength: 32,
      },
      fieldNumber: 3,
      minItems: 0,
      maxItems: 64,
    },
  },
};*/



module.exports = {
    CHAIN_STATE_HELLO_COUNTER,
    helloCounterSchema,
    helloAssetSchema
};

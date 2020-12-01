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
  $id: "lisk/hello/asset",
  type: "object",
  required: ["helloString"],
  properties: {
    helloString: {
      dataType: "string",
      fieldNumber: 1,
    },
  },
};

module.exports = {
    CHAIN_STATE_HELLO_COUNTER,
    helloCounterSchema,
    helloAssetSchema
};

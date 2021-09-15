const transactionSchema = {
  "$id":"lisk/transaction",
  "type":"object",
  "required":[
    "moduleID",
    "assetID",
    "nonce",
    "fee",
    "senderPublicKey",
    "asset"
  ],
  "properties":{
    "moduleID":{
      "dataType":"uint32",
      "fieldNumber":1,
      "minimum":2
    },
    "assetID":{
      "dataType":"uint32",
      "fieldNumber":2
    },
    "nonce":{
      "dataType":"uint64",
      "fieldNumber":3
    },
    "fee":{
      "dataType":"uint64",
      "fieldNumber":4
    },
    "senderPublicKey":{
      "dataType":"bytes",
      "fieldNumber":5,
      "minLength":32,
      "maxLength":32
    },
    "asset":{
      "dataType":"bytes",
      "fieldNumber":6
    },
    "signatures":{
      "type":"array",
      "items":{
        "dataType":"bytes"
      },
      "fieldNumber":7
    }
  }
};

const transferAssetSchema = {
  $id: 'lisk/transfer-asset',
  title: 'Transfer transaction asset',
  type: 'object',
  required: ['amount', 'recipientAddress', 'data'],
  properties: {
    amount: {
      dataType: 'uint64',
      fieldNumber: 1,
    },
    recipientAddress: {
      dataType: 'bytes',
      fieldNumber: 2,
      minLength: 20,
      maxLength: 20,
    },
    data: {
      dataType: 'string',
      fieldNumber: 3,
      minLength: 0,
      maxLength: 64,
    },
  },
};

module.exports = {transactionSchema,transferAssetSchema}

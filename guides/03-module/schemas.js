const myAccountSchema = {
  // Root type must be type object
  type: "object",
  // Properties for the object
  properties: {
    key1: {
      fieldNumber: 1,
      dataType: "string",
    },
    key2: {
      fieldNumber: 2,
      dataType: "boolean",
    },
    key3: {
      fieldNumber: 3,
      dataType: "uint64",
    }
  },
  // Default values for the different properties
  default: {
    key1 : "",
    key2 : false,
    key3 : 0
  }
};

module.exports = {
  myAccountSchema
};



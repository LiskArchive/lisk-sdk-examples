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

const myAssetSchema = {
  // Unique identifier of the schema throughout the system
  $id: "/unique-id",
  // Root type must be type object
  type: "object",
  // Required properties
  required: ["key1","key2"],
  // Properties for the object
  properties: {
    key1: {
      dataType: "string",
      fieldNumber: 1,
    },
    key2: {
      dataType: "boolean",
      fieldNumber: 2,
    },
    key3: {
      dataType: "uint64",
      fieldNumber: 3,
    }
  },
  // Default values for the different properties
  default: {
    key1 : "",
    key2 : false,
    key3 : 0
  }
}

module.exports = {
  myAccountSchema,
  myAssetSchema
};



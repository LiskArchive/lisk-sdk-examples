const myConfig = {
  type: 'object',
  properties: {
    enable: {
      type: 'boolean',
    },
    myKey1: {
      type: 'integer',
      minimum: 1,
      maximum: 9999,
    },
    myKey2: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    myKey3: {
      type: 'object',
      properties: {
        myKey4: {
          anyOf: [{ type: 'string' }, { type: 'boolean' }],
        },
        myKey5: {
          type: 'array',
        },
      },
      required: ['myKey4'],
    },
  },
  required: ['enable', 'myKey1', 'myKey2'],
  default: {
    enable: true,
    myKey1: 5000,
    myKey2: ['127.0.0.1']
  },
};

module.exports = { myConfig };

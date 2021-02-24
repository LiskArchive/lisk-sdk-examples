module.exports = {
    type: 'object',
    required: ['config'],
    properties: {
      config: {
        fieldNumber: 1,
        type: 'object',
        required: ['friends'],
        properties: {
          friends: {
              type: 'array',
              fieldNumber: 1,
              items: {
                  dataType: 'bytes',
              },
          },
          recoveryThreshold: {
              dataType: 'uint32',
              fieldNumber: 2,
          },
          delayPeriod: {
              dataType: 'uint32',
              fieldNumber: 3,
          },
          deposit: {
            dataType: 'uint64',
            fieldNumber: 4,
          }
        },
        default: {
          friends: [],
          recoveryThreshold: 0,
					delayPeriod: 0,
        },
      },
      status: {
        fieldNumber: 2,
        type: 'object',
        properties: {
          rescuer: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          created: {
            dataType: 'uint32',
            fieldNumber: 2,
          },
          deposit: {
            dataType: 'uint64',
            fieldNumber: 3,
          },
          vouchList: {
            type: 'array',
            fieldNumber: 4,
            items: {
                dataType: 'bytes',
            },
          },
          active: {
            dataType: 'boolean',
            fieldNumber: 5,
          },
        },
      }
    },
};
import { EMPTY_BUFFER } from "./constants";

export const lnsStoreSchema = {
	$id: 'lns/lns',
	type: 'object',
	required: ['type', 'label', 'value'],
	properties: {
		type: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
		label: {
			dataType: 'string',
			fieldNumber: 2,
		},
		value: {
			dataType: 'string',
			fieldNumber: 3,
		}
	},
};

export const updateRecordsCommandParamsSchema = {
  $id: 'lns/command/update-records',
  title: 'UpdateRecordsCommand transaction asset for lns module',
  type: 'object',
  required: ['records'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    records: {
      type: 'array',
      fieldNumber: 2,
      items: {
				...lnsStoreSchema,
			},
    }
  },
}

export const reverseLookupCommandParamsSchema = {
  $id: 'lns/command/reverse-lookup',
  title: 'reverseLookup transaction asset for lns module',
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
}

export const registerCommandParamsSchema = {
  $id: 'lns/register-command',
  title: 'RegisterAsset transaction asset for lns module',
  type: 'object',
  required: ['name', 'ttl', 'registerFor'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    ttl: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    registerFor: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
  },
}

export const lsnAccountStoreSchema = {
	$id: 'lns/lnsAccount',
	type: 'object',
	required: ['ownNodes', 'reverseLookup'],
	properties: {
		reverseLookup: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		ownNodes: {
			type: 'array',
			fieldNumber: 2,
			items: {
				dataType: 'bytes',
			},
		},
	},
	default: {
    reverseLookup: EMPTY_BUFFER,
		ownNodes: [],
	},
};

export const lnsNodeStoreSchema = {
	$id: 'lns/lnsNode',
	type: 'object',
	required: ['ownerAddress', 'name', 'ttl', 'expiry', 'records', 'createdAt', 'updatedAt'],
	properties: {
		ownerAddress: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		name: {
			dataType: 'string',
			fieldNumber: 2,
		},
		ttl: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
		expiry: {
			dataType: 'uint32',
			fieldNumber: 4,
		},
		createdAt: {
			dataType: 'uint32',
			fieldNumber: 5,
		},
		updatedAt: {
			dataType: 'uint32',
			fieldNumber: 6,
		},
		records: {
			type: 'array',
			fieldNumber: 7,
			items: {
				...lnsStoreSchema,
			},
		},
	},
};

export const lnsNodeJSONSchema = {
	$id: 'lns/lnsNode',
	type: 'object',
	required: ['ownerAddress', 'name', 'ttl', 'expiry', 'records', 'createdAt', 'updatedAt'],
	properties: {
		ownerAddress: {
			dataType: 'string',
			fieldNumber: 1,
		},
		name: {
			dataType: 'string',
			fieldNumber: 2,
		},
		ttl: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
		expiry: {
			dataType: 'uint32',
			fieldNumber: 4,
		},
		createdAt: {
			dataType: 'uint32',
			fieldNumber: 5,
		},
		updatedAt: {
			dataType: 'uint32',
			fieldNumber: 6,
		},
		records: {
			type: 'array',
			fieldNumber: 7,
			items: {
				...lnsStoreSchema,
			},
		},
	},
};

export const lookupAddressParamsSchema = {
	$id: 'lns/endpoint/lookupAddress',
	type: 'object',
	required: ['address'],
	properties: {
		address: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const resolveNameParamsSchema = {
	$id: 'lns/endpoint/resolveName',
	type: 'object',
	required: ['name'],
	properties: {
		name: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const resolveNodeParamsSchema = {
	$id: 'lns/endpoint/resolveNode',
	type: 'object',
	required: ['node'],
	properties: {
		node: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
};

export const registerLnsEventSchema = {
	$id: 'lns/events/register',
	type: 'object',
	required: ['senderAddress', 'name', 'ttl', 'registerFor', 'result'],
	properties: {
		senderAddress: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		name: {
			dataType: 'string',
			fieldNumber: 2,
		},
		ttl: {
			dataType: 'number',
			fieldNumber: 3,
		},
		registerFor: {
			dataType: 'number',
			fieldNumber: 4,
		},
		result: {
			dataType: 'uint32',
			fieldNumber: 5,
		},
	},
};

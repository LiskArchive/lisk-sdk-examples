import { LNSNodeRecord, LNSNodeRecordJSON, lnsNodeRecordSchema } from './lns_node_record';

export interface LNSNode {
	ownerAddress: Buffer;
	name: string;
	ttl: number;
	expiry: number;
	records: LNSNodeRecord[];
	createdAt: number;
	updatedAt: number;
}

export interface LNSNodeJSON {
	ownerAddress: string;
	name: string;
	ttl: number;
	expiry: number;
	records: LNSNodeRecordJSON[];
	createdAt: number;
	updatedAt: number;
}


export const lnsNodeSchema = {
	$id: 'lisk/lns/lnsNode',
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
				...lnsNodeRecordSchema,
			},
		},
	},
};

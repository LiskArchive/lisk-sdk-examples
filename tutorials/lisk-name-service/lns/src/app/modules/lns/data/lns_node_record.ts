export interface LNSNodeRecord {
	type: number;
	label: string;
	value: string;
}

export type LNSNodeRecordJSON = LNSNodeRecord;

export const lnsNodeRecordSchema = {
	$id: 'lisk/lns/lnsNodeRecord',
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
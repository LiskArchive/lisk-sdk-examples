import { EMPTY_BUFFER } from "../constants";

export interface LNSAccountProps {
	lns: {
		ownNodes: Buffer[];
		reverseLookup: Buffer;
	};
}

export const lsnAccountPropsSchema = {
	$id: 'lisk/lns/lnsAccount',
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
		ownNodes: [],
		reverseLookup: EMPTY_BUFFER,
	},
};

export interface CreatePinProps {
	message: string;
}

export const createPinPropsSchema = {
	$id: 'pin/createPin-asset',
	title: 'CreatePinAsset transaction asset for pin module',
	type: 'object',
	required: ['message'],
	properties: {
		message: {
			dataType: 'string',
			fieldNumber: 1,
			minLength: 3,
			maxLength: 256,
		}
	}
};

export interface PinProps {
	content: string;
	date: number;
	author: string;
	replies: [];
	likes: [];
}

export const pinPropsSchema = {
	$id: 'pin/pins',
	title: 'CreatePinAsset transaction asset for pin module',
	type: 'object',
	required: ['message'],
	properties: {
		content: {
			dataType: 'string',
			fieldNumber: 1,
			minLength: 3,
			maxLength: 256,
		},
		date: {
			dataType: 'uint32',
			fieldNumber: 2,
		},
		author: {
			dataType: 'string',
			fieldNumber: 3,
		},
		replies: {
			dataType: 'array',
			fieldNumber: 4,
			items: {
				dataType: 'string',
			},
		},
		likes: {
			dataType: 'string',
			fieldNumber: 5,
			items: {
				dataType: 'string',
			},
		}
	}
};
export interface CreateHelloParams {
	message: string;
}

export const createHelloSchema = {
	$id: 'hello/createHello-params',
	title: 'CreateHelloCommand transaction parameter for the Hello module',
	type: 'object',
	required: ['message'],
	properties: {
		message: {
			dataType: 'string',
			fieldNumber: 1,
			minLength: 3,
			maxLength: 256,
		},
	},
};

export const newHelloEventSchema = {
	$id: '/hello/events/new_hello',
	type: 'object',
	required: ['senderAddress', 'message'],
	properties: {
		senderAddress: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		message: {
			dataType: 'string',
			fieldNumber: 2,
		},
	},
};

export const configSchema = {
	$id: '/hello/config',
	type: 'object',
	properties: {
		maxMessageLength: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
		minMessageLength: {
			dataType: 'uint32',
			fieldNumber: 2,
		},
		blacklist: {
			type: 'array',
			fieldNumber: 3,
			items: {
				dataType: 'string',
				minLength: 1,
				maxLength: 40,
			},
		},
	},
	required: [
		'maxMessageLength',
		'minMessageLength',
		'blacklist'
	],
};
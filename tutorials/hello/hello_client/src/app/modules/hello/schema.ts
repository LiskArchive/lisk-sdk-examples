export interface CreateHelloParams {
	message: string;
}

export const createHelloSchema = {
	$id: 'hello/createHello-params',
	title: 'CreateHelloCommand transaction asset for hello module',
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
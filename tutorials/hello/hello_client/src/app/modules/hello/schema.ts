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

export const configSchema = {
	$id: '/hello/config',
	type: 'object',
	properties: {
		maxMessageLength: {
			type: 'integer',
		},
		minMessageLength: {
			type: 'integer',
		},
		blacklist: {
			type: 'array',
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
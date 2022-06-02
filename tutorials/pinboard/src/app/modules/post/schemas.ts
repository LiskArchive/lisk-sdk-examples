export interface PostboardAccountProps {
	address: Buffer;
	keys: {
		mandatoryKeys: Buffer[];
		numberOfSignatures: number;
		optionalKeys: Buffer[];
	};
	sequence: {
		nonce: number;
	};
	token: {
		balance: number;
	};
	following: string[];
	followers: string[];
	posts: string[];
	replies: string[];
}

export const postboardAccountPropsSchema = {
	type: 'object',
	properties: {
		following: {
			fieldNumber: 1,
			type: 'array',
			items: {
				dataType: 'Buffer',
			}
		},
		followers: {
			fieldNumber: 2,
			type: 'array',
			items: {
				dataType: 'Buffer',
			}
		},
		posts: {
			fieldNumber: 3,
			type: 'array',
			items: {
				dataType: 'string',
			}
		},
		replies: {
			fieldNumber: 4,
			type: 'array',
			items: {
				dataType: 'Buffer',
			}
		}
	},
	default: {
		followers: [],
		following: [],
		posts: [],
		replies: []
	},
};

export interface CreatePostProps {
	message: string;
}

export const createPostPropsSchema = {
	$id: 'post/createPost-asset',
	title: 'CreatePostAsset transaction asset for post module',
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

export interface PostProps {
	content: string;
	date: number;
	author: string;
	replies: [];
	likes: [];
}

export const postPropsSchema = {
	$id: 'post/posts',
	title: 'CreatePostAsset transaction asset for post module',
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
			dataType: 'array',
			fieldNumber: 5,
			items: {
				dataType: 'string',
			},
		}
	}
};

export const accountSchema = {
	$id: '/account/base',
	properties: {
		address: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		keys: {
			fieldNumber: 4,
			properties: {
				mandatoryKeys: {
					fieldNumber: 2,
					items: {
						dataType: 'bytes',
					},
					type: 'array',
				},
				numberOfSignatures: {
					dataType: 'uint32',
					fieldNumber: 1,
				},
				optionalKeys: {
					fieldNumber: 3,
					items: {
						dataType: 'bytes',
					},
					type: 'array',
				},
			},
			type: 'object',
		},
		sequence: {
			fieldNumber: 3,
			properties: {
				nonce: {
					dataType: 'uint64',
					fieldNumber: 1,
				},
			},
			type: 'object',
		},
		token: {
			fieldNumber: 2,
			properties: {
				balance: {
					dataType: 'uint64',
					fieldNumber: 1,
				},
			},
			type: 'object',
		},
	},
	required: ['address', 'keys', 'sequence', 'token'],
	type: 'object',
};

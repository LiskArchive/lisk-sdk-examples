export const postboardAccountPropsSchema = {
	type: 'object',
	properties: {
		following: {
			fieldNumber: 1,
			type: 'array',
			items: {
				dataType: 'bytes',
			},
		},
		followers: {
			fieldNumber: 2,
			type: 'array',
			items: {
				dataType: 'bytes',
			},
		},
		posts: {
			fieldNumber: 3,
			type: 'array',
			items: {
				dataType: 'string',
			},
		},
		replies: {
			fieldNumber: 4,
			type: 'array',
			items: {
				dataType: 'string',
			},
		},
		likes: {
			fieldNumber: 5,
			type: 'array',
			items: {
				dataType: 'string',
			},
		},
	},
	default: {
		followers: [],
		following: [],
		posts: [],
		replies: [],
		likes: [],
	},
};

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
		},
	},
};

export const repostPropsSchema = {
	$id: 'post/repost-asset',
	title: 'Repost transaction asset for post module',
	type: 'object',
	required: ['postId'],
	properties: {
		postId: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const replyPropsSchema = {
	$id: 'post/reply-asset',
	title: 'Reply transaction asset for post module',
	type: 'object',
	required: ['postId', 'content'],
	properties: {
		postId: {
			dataType: 'string',
			fieldNumber: 1,
		},
		content: {
			dataType: 'string',
			fieldNumber: 2,
			minLength: 3,
			maxLength: 256,
		},
	},
};

export const likePropsSchema = {
	$id: 'post/like-asset',
	title: 'Like transaction asset for post module',
	type: 'object',
	required: ['postId'],
	properties: {
		postId: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const followPropsSchema = {
	$id: 'post/follow-asset',
	title: 'Follow transaction asset for post module',
	type: 'object',
	required: ['account'],
	properties: {
		account: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const postPropsSchema = {
	$id: 'post/posts',
	title: 'CreatePostAsset transaction asset for post module',
	type: 'object',
	required: ['id', 'content', 'date', 'author'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		content: {
			dataType: 'string',
			fieldNumber: 2,
			minLength: 3,
			maxLength: 256,
		},
		date: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
		author: {
			dataType: 'bytes',
			fieldNumber: 4,
		},
		reposts: {
			type: 'array',
			fieldNumber: 5,
			items: {
				dataType: 'bytes',
			},
		},
		replies: {
			type: 'array',
			fieldNumber: 6,
			items: {
				type: 'object',
				properties: {
					author: {
						fieldNumber: 1,
						dataType: 'bytes',
					},
					date: {
						dataType: 'uint32',
						fieldNumber: 2,
					},
					content: {
						fieldNumber: 3,
						dataType: 'string',
					},
				},
			},
		},
		likes: {
			type: 'array',
			fieldNumber: 7,
			items: {
				dataType: 'bytes',
			},
		},
	},
};

export const allPostsSchema = {
	$id: 'lisk/post/posts',
	type: 'object',
	required: ['posts'],
	properties: {
		posts: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'string',
			},
		},
	},
};

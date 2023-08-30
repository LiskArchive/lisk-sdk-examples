export interface PostboardAccountProps {
	address: Buffer;
	keys: {
		mandatoryKeys: Buffer[];
		numberOfSignatures: number;
		optionalKeys: Buffer[];
	};
	sequence: {
		nonce: string;
	};
	token: {
		balance: string;
	};
	post: {
		following: Buffer[]; // User Buffer
		followers: Buffer[]; // User Buffer
		posts: string[]; // PostId
		replies: string[]; // PostId#replyId
		likes: string[]; // PostId
	};
}

export interface RepostProps {
	postId: string;
}

export interface ReplyProps {
	postId: string;
	content: string;
}

export interface LikeProps {
	postId: string;
}

export interface FollowProps {
	account: string;
}

export interface CreatePostProps {
	message: string;
}

export interface PostProps {
	id: string;
	content: string;
	date: number;
	author: Buffer;
	replies: {
		author: Buffer;
		date: number;
		content: string;
	}[];
	reposts: Buffer[];
	likes: Buffer[];
}

export interface PostPropsJSON {
	id: string;
	content: string;
	date: number;
	author: string;
	replies: {
		author: string;
		date: number;
		content: string;
	}[];
	reposts: string[];
	likes: string[];
}

export interface StringProps {
	id: string;
	content: string;
	date: number;
	author: string;
	replies: {
		author: string;
		date: number;
		content: string;
	}[];
	reposts: string[];
	likes: string[];
}

export interface AllPosts {
	posts: string[];
}

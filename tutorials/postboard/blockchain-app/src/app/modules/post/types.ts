export interface PostboardAccountProps {
	address: Buffer;
	keys: {
		mandatoryKeys: Buffer[];
		numberOfSignatures: string;
		optionalKeys: Buffer[];
	};
	sequence: {
		nonce: string;
	};
	token: {
		balance: string;
	};
	post: {
		following: Buffer[];
		followers: Buffer[];
		posts: string[];
		replies: string[];
		likes: string[];
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

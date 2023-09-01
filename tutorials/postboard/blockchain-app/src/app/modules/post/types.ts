export interface PostboardAccount {
	address: Buffer;
	post: {
		following: Buffer[]; // User Buffer
		followers: Buffer[]; // User Buffer
		posts: string[]; // PostId
		replies: string[]; // PostId#replyId
		likes: string[]; // PostId
	};
}

export interface PostboardAccountJSON {
	address: string;
	post: {
		following: string[]; // User Buffer
		followers: string[]; // User Buffer
		posts: string[]; // PostId
		replies: string[]; // PostId#replyId
		likes: string[]; // PostId
	};
}

export interface Repost {
	postId: string;
}

export interface Reply {
	postId: string;
	content: string;
}

export interface Like {
	postId: string;
}

export interface Follow {
	account: string;
}

export interface CreatePost {
	message: string;
}

export interface Post {
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

export interface PostJSON {
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

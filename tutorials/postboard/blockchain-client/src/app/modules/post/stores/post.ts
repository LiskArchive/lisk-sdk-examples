import { BaseStore } from 'lisk-sdk';
import { postSchema } from '../schemas';

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

export class PostStore extends BaseStore<Post> {
	public schema = postSchema;
}

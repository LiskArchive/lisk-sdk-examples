import { BaseStore, ImmutableStoreGetter, StoreGetter } from 'lisk-sdk';
import { allPostsSchema } from '../schemas';

export interface AllPosts {
	posts: string[];
}

const DEFAULT_KEY = Buffer.alloc(0);

export class AllPostsStore extends BaseStore<AllPosts> {
	public schema = allPostsSchema;
	// public schema
	public async getAllPosts(context: ImmutableStoreGetter): Promise<AllPosts> {
		if (!(await this.has(context, DEFAULT_KEY))) {
			return {
				posts: [],
			};
		}
		return this.get(context, DEFAULT_KEY);
	}

	public async setAllPosts(context: StoreGetter, posts: AllPosts) {
		return this.set(context, DEFAULT_KEY, posts);
	}
}

import { validator } from '@liskhq/lisk-validator';
import { BaseEndpoint, cryptography, ModuleEndpointContext } from 'lisk-sdk';
import { getLatestPostsSchema, getPostSchema } from './schemas';
import { PostStore } from './stores/post';
import { stringifyPost } from './utils';
import { AllPostsStore } from './stores/all_posts';
import { AccountStore } from './stores/account';
import { PostboardAccountJSON, PostJSON } from './types';

export class PostEndpoint extends BaseEndpoint {
	public async getPost(context: ModuleEndpointContext): Promise<PostJSON> {
		validator.validate<{ id: string }>(getPostSchema, context.params);
		const { id } = context.params;

		const post = await this.stores.get(PostStore).get(context, Buffer.from(id, 'hex'));

		return stringifyPost(post);
	}

	public async getLatestPosts(context: ModuleEndpointContext): Promise<string[]> {
		validator.validate<{ address: string }>(getLatestPostsSchema, context.params);
		const { address } = context.params;

		if (address) {
			const account = await this.stores
				.get(AccountStore)
				.getOrDefault(context, cryptography.address.getAddressFromLisk32Address(address));
			return account.post.posts;
		}
		const { posts } = await this.stores.get(AllPostsStore).getAllPosts(context);
		return posts;
	}

	public async getAccount(context: ModuleEndpointContext): Promise<PostboardAccountJSON> {
		validator.validate<{ address: string }>(getLatestPostsSchema, context.params);
		const { address } = context.params;

		const account = await this.stores
			.get(AccountStore)
			.getOrDefault(context, cryptography.address.getAddressFromLisk32Address(address));
		return {
			...account,
			address: cryptography.address.getLisk32AddressFromAddress(account.address),
			post: {
				...account.post,
				following: account.post.following.map(followAddress =>
					cryptography.address.getLisk32AddressFromAddress(followAddress),
				),
				followers: account.post.followers.map(followAddress =>
					cryptography.address.getLisk32AddressFromAddress(followAddress),
				),
			},
		};
	}
}

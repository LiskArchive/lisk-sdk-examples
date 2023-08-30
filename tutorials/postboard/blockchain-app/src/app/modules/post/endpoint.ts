/*
 * Copyright © 2023 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

import { validator } from '@liskhq/lisk-validator';
import { BaseEndpoint, cryptography, ModuleEndpointContext } from 'lisk-sdk';
import { getLatestPostsSchema, getPostSchema } from './schemas';
import { PostStore } from './stores/post';
import { stringifyPost } from './utils';
import { AllPostsStore } from './stores/all_posts';
import { AccountStore } from './stores/account';

export class PostEndpoint extends BaseEndpoint {
	public async getPost(context: ModuleEndpointContext) {
		validator.validate<{ id: string }>(getPostSchema, context.params);
		const { id } = context.params;

		const post = await this.stores.get(PostStore).get(context, Buffer.from(id, 'hex'));

		return stringifyPost(post);
	}

	public async getLatestPosts(context: ModuleEndpointContext) {
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

	public async getAccount(context: ModuleEndpointContext) {
		validator.validate<{ address: string }>(getLatestPostsSchema, context.params);
		const { address } = context.params;

		const account = await this.stores
			.get(AccountStore)
			.getOrDefault(context, cryptography.address.getAddressFromLisk32Address(address));
		return {
			...account,
			address: cryptography.address.getLisk32AddressFromAddress(account.address),
			sequence: {
				nonce: account.sequence.nonce.toString(),
			},
			token: {
				balance: account.token.balance.toString(),
			},
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

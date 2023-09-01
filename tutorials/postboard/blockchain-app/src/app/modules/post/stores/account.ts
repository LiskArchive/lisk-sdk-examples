import { NotFoundError } from '@liskhq/lisk-chain';
import { BaseStore, ImmutableStoreGetter } from 'lisk-sdk';
import { PostboardAccount } from '../types';
import { accountSchema } from '../schemas';

export class AccountStore extends BaseStore<PostboardAccount> {
	public schema = accountSchema;

	public async getOrDefault(
		context: ImmutableStoreGetter,
		address: Buffer,
	): Promise<PostboardAccount> {
		try {
			const authAccount = await this.get(context, address);
			return authAccount;
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}

			return {
				address,
				post: {
					following: [],
					followers: [],
					posts: [],
					replies: [],
					likes: [],
				},
			};
		}
	}
}

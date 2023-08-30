import { NotFoundError } from '@liskhq/lisk-chain';
import { BaseStore, ImmutableStoreGetter } from 'lisk-sdk';
import { PostboardAccountProps } from '../types';
import { accountSchema } from '../schemas';

export class AccountStore extends BaseStore<PostboardAccountProps> {
	public schema = accountSchema;

	public async getOrDefault(context: ImmutableStoreGetter, address: Buffer) {
		try {
			const authAccount = await this.get(context, address);
			return authAccount;
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}

			return {
				address,
				keys: {
					numberOfSignatures: 0,
					mandatoryKeys: [],
					optionalKeys: [],
				},
				sequence: {
					nonce: '0',
				},
				token: {
					balance: '0',
				},
				post: {
					following: [],
					followers: [],
					posts: [],
					replies: [],
					likes: [],
				},
			} as PostboardAccountProps;
		}
	}
}

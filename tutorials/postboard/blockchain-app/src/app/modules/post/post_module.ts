import {
	AfterBlockApplyContext,
	AfterGenesisBlockApplyContext,
	BaseModule,
	BeforeBlockApplyContext,
	codec,
	cryptography,
	TransactionApplyContext,
} from 'lisk-sdk';
import { CreatePostAsset } from './assets/create_post_asset';
import { FollowAsset } from './assets/follow_asset';
import { LikeAsset } from './assets/like_asset';
import { ReplyAsset } from './assets/reply_asset';
import { RepostAsset } from './assets/repost_asset';
import { allPostsSchema, postboardAccountPropsSchema, postPropsSchema } from './schemas';
import { AllPosts, PostboardAccountProps, PostProps, StringProps } from './types';

const stringifyPost: (post: any) => any = function (p: any): any {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	p.author = cryptography.getLisk32AddressFromAddress(p.author);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	p.reposts.forEach((item, index) => {
		p.reposts[index] = cryptography.getLisk32AddressFromAddress(item);
	});
	//  p.reposts.forEach((item, index) => { cryptography.getLisk32AddressFromAddress(item));
	p.replies.forEach((item, index) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		p.replies[index].author = cryptography.getLisk32AddressFromAddress(item.author);
	});
	p.likes.forEach((item, index) => {
		p.likes[index] = cryptography.getLisk32AddressFromAddress(item);
	});
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return p;
};

export class PostModule extends BaseModule {
	public actions = {
		// Get post by ID
		getPost: async params => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const postBuffer = await this._dataAccess.getChainState(params.id);
			let post: PostProps;
			let sPost: StringProps;
			if (postBuffer) {
				post = codec.decode(postPropsSchema, postBuffer);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				sPost = stringifyPost(post) as StringProps;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return sPost;
			}
			return {};
		},
		// Get latests posts
		getLatestPosts: async params => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const { account: address } = params;
			if (address) {
				const account:
					| PostboardAccountProps
					| undefined = await this._dataAccess.getAccountByAddress(Buffer.from(address, 'hex'));
				return account.post.posts;
			}
			const allPostsBuffer: Buffer | undefined = await this._dataAccess.getChainState('post/all');
			if (allPostsBuffer) {
				const allPosts: AllPosts = codec.decode(allPostsSchema, allPostsBuffer);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return allPosts.posts;
			}
			return [];
		},
	};
	public reducers = {
		// Example below
		// getBalance: async (
		// 	params: Record<string, unknown>,
		// 	stateStore: StateStore,
		// ): Promise<bigint> => {
		// 	const { address } = params;
		// 	if (!Buffer.isBuffer(address)) {
		// 		throw new Error('Address must be a buffer');
		// 	}
		// 	const account = await stateStore.account.getOrDefault<TokenAccount>(address);
		// 	return account.token.balance;
		// },
	};
	public name = 'post';
	public transactionAssets = [
		new CreatePostAsset(),
		new RepostAsset(),
		new ReplyAsset(),
		new LikeAsset(),
		new FollowAsset(),
	];
	public events = [
		// Example below
		// 'post:newBlock',
	];
	public id = 1000;
	public accountSchema = postboardAccountPropsSchema;
	// public constructor(genesisConfig: GenesisConfig) {
	//     super(genesisConfig);
	// }

	// Lifecycle hooks
	public async beforeBlockApply(_input: BeforeBlockApplyContext) {
		// Get any data from stateStore using block info, below is an example getting a generator
		// const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
	}

	public async afterBlockApply(_input: AfterBlockApplyContext) {
		// Get any data from stateStore using block info, below is an example getting a generator
		// const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async beforeTransactionApply(_input: TransactionApplyContext) {
		// Get any data from stateStore using transaction info, below is an example
		// const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
	}

	public async afterTransactionApply(_input: TransactionApplyContext) {
		// Get any data from stateStore using transaction info, below is an example
		// const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		// Get any data from genesis block, for example get all genesis accounts
		// const genesisAccounts = genesisBlock.header.asset.accounts;
	}
}

/* eslint-disable class-methods-use-this */

import {
    AfterBlockApplyContext,


    AfterGenesisBlockApplyContext, BaseModule,


    BeforeBlockApplyContext, codec, cryptography, TransactionApplyContext
} from 'lisk-sdk';
import { CreatePostAsset } from "./assets/create_post_asset";
import { FollowAsset } from "./assets/follow_asset";
import { LikeAsset } from "./assets/like_asset";
import { ReplyAsset } from "./assets/reply_asset";
import { RepostAsset } from "./assets/repost_asset";
import { postboardAccountPropsSchema, postPropsSchema, PostProps, StringProps } from './schemas';

const stringifyPost: (post: any) => any = function (
  p: any,
): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sPost = p;
    /* const sPost = {
        author: "",
        replies: [{author:"", date: 0, content:""}],
        reposts: [""],
        likes: [""]
    } */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sPost.author = cryptography.getLisk32AddressFromAddress(p.author);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sPost.reposts[0] = cryptography.getLisk32AddressFromAddress(p.reposts[0]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // sPost.likes[0] = cryptography.getLisk32AddressFromAddress(p.likes[0]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sPost.replies[0].author = cryptography.getLisk32AddressFromAddress(p.replies[0].author);
    // const fullPost = {...p, ...sPost}
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return sPost;
};

export class PostModule extends BaseModule {
    public actions = {
        getPost: async (params) => {
            // this._logger.info(params, 'The params: ');
            const postBuffer = await this._dataAccess.getChainState(params.id);
            let post: PostProps;
            let sPost: StringProps;
            if (postBuffer) {
                post = codec.decode(postPropsSchema, postBuffer);
                sPost = stringifyPost(post);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access

                return sPost;
            }
            return {};
        }
        // Example below
        // getBalance: async (params) => this._dataAccess.account.get(params.address).token.balance,
        // getBlockByID: async (params) => this._dataAccess.blocks.get(params.id),
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
    public transactionAssets = [new CreatePostAsset(), new RepostAsset(), new ReplyAsset(), new LikeAsset(), new FollowAsset()];
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

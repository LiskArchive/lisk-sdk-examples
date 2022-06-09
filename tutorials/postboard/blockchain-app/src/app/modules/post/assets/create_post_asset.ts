import { BaseAsset, ApplyAssetContext, codec, cryptography, StateStore } from 'lisk-sdk';
import {
	createPostPropsSchema,
	CreatePostProps,
	postPropsSchema,
	PostboardAccountProps,
	allPostsSchema,
	AllPosts
} from '../schemas';

const getIDForPost: (address: Buffer, nonce: bigint) => Buffer = function (
	a: Buffer,
	n: bigint
): Buffer {
	const nonceBuffer = Buffer.alloc(8);
	nonceBuffer.writeBigInt64LE(n);
	const seed = Buffer.concat([a, nonceBuffer]);
	return cryptography.hash(seed);
};

const getAllPosts = async (stateStore: StateStore) => {
	const allPostsBuffer = await stateStore.chain.get(
		'post/all'
	);
	if (!allPostsBuffer) {
		return {
			posts:[]
		};
	}
	const posts: AllPosts = codec.decode(
		allPostsSchema,
		allPostsBuffer
	);
	return posts;
};

/* const setAllPosts = async (stateStore, Posts) => {
	const allPosts = {
		posts: Posts.sort((a, b) => a.id.compare(b.id)),
	};

	await stateStore.chain.set(
		'post/all',
		codec.encode(allPostsSchema, allPosts)
	);
}; */

export class CreatePostAsset extends BaseAsset<CreatePostProps> {
	public name = 'createPost';
  public id = 0;

  // Define schema for asset
	public schema = createPostPropsSchema;


/*  public validate({ _asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  } */

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<CreatePostProps>): Promise<void> {
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
		const	postId = getIDForPost(transaction.senderAddress, transaction.nonce).toString('hex');
		const post = {
			id: postId,
			content: asset.message,
			date: 1,
			author: sender.address,
			replies: [],
			reposts: [],
			likes: []
		};

		// Save post
		await stateStore.chain.set(postId, codec.encode(postPropsSchema, post));

		// Save to allPosts
		const allPosts: AllPosts = await getAllPosts(stateStore);


		allPosts.posts.push(postId);
		await stateStore.chain.set(
			'post/all',
			codec.encode(allPostsSchema, allPosts)
		);

		// Save in users account
		sender.post.posts.push(postId);
		await stateStore.account.set(sender.address, sender);
	}
}

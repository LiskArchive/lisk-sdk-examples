import { BaseAsset, ApplyAssetContext, codec, cryptography, StateStore } from 'lisk-sdk';
import { createPostPropsSchema, postPropsSchema, allPostsSchema } from '../schemas';
import { AllPosts, CreatePostProps, PostboardAccountProps } from '../types';

const getIDForPost: (address: Buffer, nonce: bigint) => Buffer = function (
	a: Buffer,
	n: bigint,
): Buffer {
	const nonceBuffer = Buffer.alloc(8);
	nonceBuffer.writeBigInt64LE(n);
	const seed = Buffer.concat([a, nonceBuffer]);
	return cryptography.hash(seed);
};

const getAllPosts = async (stateStore: StateStore) => {
	const allPostsBuffer = await stateStore.chain.get('post/all');
	if (!allPostsBuffer) {
		return {
			posts: [],
		};
	}
	const posts: AllPosts = codec.decode(allPostsSchema, allPostsBuffer);
	return posts;
};

export class CreatePostAsset extends BaseAsset<CreatePostProps> {
	public name = 'createPost';
	public id = 0;

	// Define schema for asset
	public schema = createPostPropsSchema;

	/*  public validate({ _asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  } */

	public async apply({
		asset,
		transaction,
		stateStore,
	}: ApplyAssetContext<CreatePostProps>): Promise<void> {
		// Get sender account
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
		// Create a unique ID for the post
		const postId = getIDForPost(transaction.senderAddress, transaction.nonce).toString('hex');
		// Create the post object
		const post = {
			id: postId,
			content: asset.message,
			date: Math.floor(Date.now() / 1000),
			author: sender.address,
			replies: [],
			reposts: [],
			likes: [],
		};

		// Save post in the DB
		await stateStore.chain.set(postId, codec.encode(postPropsSchema, post));

		// Save postID to allPosts list
		const allPosts: AllPosts = await getAllPosts(stateStore);
		allPosts.posts.push(postId);
		await stateStore.chain.set('post/all', codec.encode(allPostsSchema, allPosts));

		// Save postID in users account
		sender.post.posts.push(postId);
		await stateStore.account.set(sender.address, sender);
	}
}

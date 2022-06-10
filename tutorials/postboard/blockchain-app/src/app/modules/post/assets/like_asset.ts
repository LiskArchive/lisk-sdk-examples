import { BaseAsset, ApplyAssetContext, codec } from 'lisk-sdk';
import { postPropsSchema, likePropsSchema } from '../schemas';
import { LikeProps, PostboardAccountProps, PostProps } from '../types';

export class LikeAsset extends BaseAsset<LikeProps> {
	public name = 'like';
	public id = 3;

	// Define schema for asset
	public schema = likePropsSchema;

	/*  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  } */

	public async apply({
		asset,
		transaction,
		stateStore,
	}: ApplyAssetContext<LikeProps>): Promise<void> {
		// Get sender account from DB
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
		// Get post from DB
		const oPostBuffer = await stateStore.chain.get(asset.postId);
		if (oPostBuffer) {
			const oPost: PostProps = codec.decode(postPropsSchema, oPostBuffer);

			// Check if the post is already liked by the sender account
			const postIndex = oPost.likes.indexOf(transaction.senderAddress);
			const senderIndex = sender.post.likes.indexOf(asset.postId);
			// If the post is already liked
			if (postIndex > -1 || senderIndex > -1) {
				// Remove the sender address from the likes list of the post
				oPost.likes.splice(postIndex, 1);
				// Remove the postID from the likes list of the sender account
				sender.post.likes.splice(postIndex, 1);
				// If the post is not already liked by the sender
			} else {
				// Add the sender address to the likes list of the post
				oPost.likes.push(transaction.senderAddress);
				// Add the postID to the likes list of the sender account
				sender.post.likes.push(asset.postId);
			}

			// Save the updated post and sender account in the DB
			await stateStore.chain.set(asset.postId, codec.encode(postPropsSchema, oPost));
			await stateStore.account.set(sender.address, sender);
		} else {
			throw new Error('PostID not found.');
		}
	}
}

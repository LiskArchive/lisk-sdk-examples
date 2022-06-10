import { BaseAsset, ApplyAssetContext, codec } from 'lisk-sdk';
import { PostboardAccountProps, postPropsSchema, PostProps, RepostProps, repostPropsSchema } from '../schemas';

export class RepostAsset extends BaseAsset<RepostProps> {
	public name = 'repost';
  public id = 1;

  // Define schema for asset
	public schema = repostPropsSchema;

/*  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  } */

  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<RepostProps>): Promise<void> {
		// Get sender account
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
		// Get post by ID
		const oPostBuffer = await stateStore.chain.get(asset.postId);

		if (oPostBuffer) {
			const oPost: PostProps = codec.decode(postPropsSchema, oPostBuffer);

			// Add sender address to the reposts list of the post
			oPost.reposts.push(transaction.senderAddress);
			// Add postID to the post.posts list of the sender account
			sender.post.posts.push(asset.postId)

			// Save the updated post and sender account in the DB
			await stateStore.chain.set(asset.postId, codec.encode(postPropsSchema, oPost));
			await stateStore.account.set(sender.address, sender);
		} else {
			throw new Error('PostID not found.');
		}
	}
}

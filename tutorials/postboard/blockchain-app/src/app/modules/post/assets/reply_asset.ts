import { BaseAsset, ApplyAssetContext, codec } from 'lisk-sdk';
import { PostboardAccountProps, PostProps, postPropsSchema, replyPropsSchema, ReplyProps } from '../schemas';

export class ReplyAsset extends BaseAsset {
	public name = 'reply';
  public id = 2;

  // Define schema for asset
	public schema = replyPropsSchema;

/*  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  } */

  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<ReplyProps>): Promise<void> {
		// Get sender account by address
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
		// Get post by ID
		const oPostBuffer = await stateStore.chain.get(asset.postId);
		if (oPostBuffer) {
			const oPost: PostProps = codec.decode(postPropsSchema, oPostBuffer);

			// Create reply object
			const reply = {
				author: sender.address,
				date: Date.now(),
				content: asset.content
			}

			// Add reply to the replies list of the post object
			oPost.replies.push(reply);

			// Add postID & replyID to the replies list of the sender account
			const replyId = oPost.replies.length.toString();
			sender.post.replies.push(`${asset.postId}#${replyId}`);

			// Save the updated post and sender account in the DB
			await stateStore.chain.set(asset.postId, codec.encode(postPropsSchema, oPost));
			await stateStore.account.set(sender.address, sender);
		} else {
			throw new Error('PostID not found.');
		}
	}
}

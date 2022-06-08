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
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);

		const oPostBuffer = await stateStore.chain.get(asset.postId);
		if (oPostBuffer) {
			const oPost: PostProps = codec.decode(postPropsSchema, oPostBuffer);
			const reply = {
				author: sender.address,
				date: Date.now(),
				content: asset.content
			}
			const replyId = oPost.replies.length.toString();
			oPost.replies.push(reply);
			await stateStore.chain.set(asset.postId, codec.encode(postPropsSchema, oPost));

			sender.post.replies.push(`${asset.postId}#${replyId}`);
			await stateStore.account.set(sender.address, sender);
		} else {
			throw new Error('PostID not found.');
		}
	}
}

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
			// eslint-disable-next-line no-console
			console.log('====== oPostBuffer: ', oPostBuffer);
			const reply = {
				author: sender.address,
				date: Date.now(),
				content: asset.content
			}
			oPost.replies.push(reply);
			// eslint-disable-next-line no-console
			console.log('====== oPost: ', oPost);
			const replyId = oPost.replies.length.toString();
			await stateStore.chain.set(asset.postId, codec.encode(postPropsSchema, oPost));

			sender.post.replies.push(`${asset.postId}#${replyId}`);
			// eslint-disable-next-line no-console
			console.log('====== sender: ', sender);
			await stateStore.account.set(sender.address, sender);
		} else {
			throw new Error('PostID not found.');
		}
	}
}

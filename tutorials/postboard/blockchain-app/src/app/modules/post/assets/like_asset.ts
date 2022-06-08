import { BaseAsset, ApplyAssetContext, codec } from 'lisk-sdk';
import { PostProps, postPropsSchema, LikeProps, likePropsSchema, PostboardAccountProps } from '../schemas';

export class LikeAsset extends BaseAsset<LikeProps> {
	public name = 'like';
  public id = 3;

  // Define schema for asset
	public schema = likePropsSchema;

/*  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  } */

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<LikeProps>): Promise<void> {
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
		const oPostBuffer = await stateStore.chain.get(asset.postId);
		if (oPostBuffer) {
			const oPost: PostProps = codec.decode(postPropsSchema, oPostBuffer);
			// eslint-disable-next-line no-console
			console.log('====== oPostBuffer: ', oPostBuffer);
			const postIndex = oPost.likes.indexOf(transaction.senderAddress);
			const senderIndex = sender.post.likes.indexOf(asset.postId);
			if (postIndex > -1 && senderIndex > -1) {
				oPost.likes.splice(postIndex, 1);
				sender.post.likes.splice(postIndex, 1);
			} else {
				oPost.likes.push(transaction.senderAddress);
				sender.post.likes.push(asset.postId);
			}
			// eslint-disable-next-line no-console
			console.log('====== oPost: ', oPost);
			await stateStore.chain.set(asset.postId, codec.encode(postPropsSchema, oPost));
		} else {
			throw new Error('PostID not found.');
		}
	}
}

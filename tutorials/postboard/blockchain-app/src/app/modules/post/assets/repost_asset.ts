import { BaseAsset, ApplyAssetContext, ValidateAssetContext, codec } from 'lisk-sdk';
import { PostboardAccountProps, postPropsSchema, PostProps, RepostProps, repostPropsSchema } from '../schemas';

export class RepostAsset extends BaseAsset<RepostProps> {
	public name = 'repost';
  public id = 1;

  // Define schema for asset
	public schema = repostPropsSchema;

/*  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  } */

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<RepostProps>): Promise<void> {
		const oPostBuffer = await stateStore.chain.get(asset.postId);
		if (oPostBuffer) {
			const oPost: PostProps = codec.decode(postPropsSchema, oPostBuffer);
			oPost.reposts.push(transaction.senderAddress);
			// eslint-disable-next-line no-console
			console.log('oPost :', oPost);
			await stateStore.chain.set(asset.postId, codec.encode(postPropsSchema, oPost));

			const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
			sender.post.posts.push(asset.postId)
			await stateStore.account.set(sender.address, sender);
		} else {
			throw new Error('PostID not found.');
		}

	}
}

import { BaseAsset, ApplyAssetContext, codec, cryptography } from 'lisk-sdk';
import { createPostPropsSchema, CreatePostProps, postPropsSchema, PostboardAccountProps } from '../schemas';

const getIDForPost: (sender: PostboardAccountProps) => Buffer = function (
	s:	PostboardAccountProps
): Buffer {
	return cryptography.hash(s.address.toString('hex') + s.sequence.nonce.toString())
};

export class CreatePostAsset extends BaseAsset {
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
		const postId = getIDForPost(sender).toString('hex');

		const post = {
			id: postId,
			content: asset.message,
			date: Date.now(),
			author: transaction.senderAddress,
			replies: [],
			likes: []
		};

		await stateStore.chain.set(postId, codec.encode(postPropsSchema, post));

		sender.posts.push(postId);
		await stateStore.account.set(sender.address, sender);
	}
}

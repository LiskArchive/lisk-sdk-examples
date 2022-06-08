import { BaseAsset, ApplyAssetContext,cryptography } from 'lisk-sdk';
import { PostboardAccountProps, followPropsSchema, FollowProps } from '../schemas';

export class FollowAsset extends BaseAsset<FollowProps> {
	public name = 'follow';
  public id = 4;

  // Define schema for asset
	public schema = followPropsSchema;

/*  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  } */

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<FollowProps>): Promise<void> {
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
		const accountBuffer = cryptography.getAddressFromLisk32Address(asset.account)
		const account = await stateStore.account.get<PostboardAccountProps>(accountBuffer);
		const indexSender = sender.post.following.indexOf(account.address);
		const indexAccount = sender.post.followers.indexOf(sender.address);

		if (indexSender > -1 && indexAccount > -1) {
			sender.post.following.splice(indexSender, 1);
			account.post.followers.splice(indexAccount, 1);
		} else {
			sender.post.following.push(account.address);
			account.post.followers.push(sender.address);
		}
		await stateStore.account.set(sender.address, sender);
		await stateStore.account.set(account.address, account);
	}
}

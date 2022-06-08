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
		const isAccountAddress = (element) => element.equals(account.address);
		const isSenderAddress = (element) => element.equals(sender.address);

		const indexSender = sender.post.following.findIndex(isAccountAddress);
		const indexAccount = account.post.followers.findIndex(isSenderAddress);
		console.log('================ sender: ',sender);
		console.log('================ account: ',account);
		console.log('================ indexSender: ',indexSender);
		console.log('indexAccount: ',indexAccount);
		if (indexSender > -1 || indexAccount > -1) {
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

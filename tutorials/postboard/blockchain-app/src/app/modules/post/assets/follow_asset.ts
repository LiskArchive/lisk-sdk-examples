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

  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<FollowProps>): Promise<void> {
		// Get sender account
		const sender = await stateStore.account.get<PostboardAccountProps>(transaction.senderAddress);
		// Get account to follow
		const accountBuffer = cryptography.getAddressFromLisk32Address(asset.account)
		const account = await stateStore.account.get<PostboardAccountProps>(accountBuffer);

		// Testing functions for findIndex()
		const isAccountAddress = (element) => element.equals(account.address);
		const isSenderAddress = (element) => element.equals(sender.address);
		// Check if sender is already following
		const indexSender = sender.post.following.findIndex(isAccountAddress);
		const indexAccount = account.post.followers.findIndex(isSenderAddress);
		// If sender is already following
		if (indexSender > -1 || indexAccount > -1) {
			// Remove account addres from the post.following list of the sender account
			sender.post.following.splice(indexSender, 1);
			// Remove sender address from the post.followers list of the account to unfollow
			account.post.followers.splice(indexAccount, 1);
		// If sender is not already following
		} else {
			// Add account address to post.following of the sender account
			sender.post.following.push(account.address);
			// Add sender address to post.followers of the account to follow
			account.post.followers.push(sender.address);
		}

		// Save the updated accounts in the DB
		await stateStore.account.set(sender.address, sender);
		await stateStore.account.set(account.address, account);
	}
}

import {
	BaseCommand,
	CommandExecuteContext,
	CommandVerifyContext,
	cryptography,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { Follow } from '../types';
import { AccountStore } from '../stores/account';
import { followSchema } from '../schemas';

export class FollowCommand extends BaseCommand {
	public schema = followSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(_context: CommandVerifyContext<Follow>): Promise<VerificationResult> {
		return {
			status: VerifyStatus.OK,
		};
	}

	public async execute(context: CommandExecuteContext<Follow>): Promise<void> {
		const { params, transaction } = context;

		const accountStore = this.stores.get(AccountStore);

		// Get Sender
		const sender = await accountStore.getOrDefault(context, transaction.senderAddress);

		// Get Account to Follow
		const account = await accountStore.getOrDefault(
			context,
			cryptography.address.getAddressFromLisk32Address(params.account),
		);

		// Testing functions for findIndex()
		const isAccountAddress = (element: Buffer) => element.equals(account.address);
		const isSenderAddress = (element: Buffer) => element.equals(sender.address);
		// Check if sender is already following
		const indexSender = sender.post.following.findIndex(isAccountAddress);
		const indexAccount = account.post.followers.findIndex(isSenderAddress);

		// If sender is already following
		if (indexSender > -1 || indexAccount > -1) {
			// Remove account address from the post.following list of the sender account
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
		await accountStore.set(context, sender.address, sender);
		await accountStore.set(context, account.address, account);
	}
}

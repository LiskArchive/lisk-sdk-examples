import {
	BaseCommand,
	CommandExecuteContext,
	CommandVerifyContext,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { Like } from '../types';
import { AccountStore } from '../stores/account';
import { likeSchema } from '../schemas';
import { PostStore } from '../stores/post';

export class LikeCommand extends BaseCommand {
	public schema = likeSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<Like>): Promise<VerificationResult> {
		const { params } = context;
		const { postId } = params;

		const postStore = this.stores.get(PostStore);
		const postExists = await postStore.has(context, Buffer.from(postId, 'hex'));

		if (!postExists) {
			throw new Error(`Post ${postId} does not exist`);
		}
		return {
			status: VerifyStatus.OK,
		};
	}

	public async execute(context: CommandExecuteContext<Like>): Promise<void> {
		const { params, transaction } = context;
		const { postId } = params;

		const postIdBuffer = Buffer.from(postId, 'hex');
		const postStore = this.stores.get(PostStore);
		const accountStore = this.stores.get(AccountStore);

		// Get Sender
		const sender = await accountStore.getOrDefault(context, transaction.senderAddress);
		const post = await postStore.get(context, postIdBuffer);

		// Check if the post is already liked by the sender account
		const postIndex = post.likes.indexOf(transaction.senderAddress);
		const senderIndex = sender.post.likes.indexOf(postId);

		// If the post is already liked
		if (postIndex > -1 || senderIndex > -1) {
			// Remove the sender address from the likes list of the post
			post.likes.splice(postIndex, 1);
			// Remove the postID from the likes list of the sender account
			sender.post.likes.splice(postIndex, 1);
			// If the post is not already liked by the sender
		} else {
			// Add the sender address to the likes list of the post
			post.likes.push(transaction.senderAddress);
			// Add the postID to the likes list of the sender account
			sender.post.likes.push(postId);
		}

		// Save the updated post and sender account in the DB
		await postStore.set(context, postIdBuffer, post);
		await accountStore.set(context, transaction.senderAddress, sender);
	}
}

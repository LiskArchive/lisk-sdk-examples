import {
	BaseCommand,
	CommandExecuteContext,
	CommandVerifyContext,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { Repost } from '../types';
import { AccountStore } from '../stores/account';
import { repostSchema } from '../schemas';
import { PostStore } from '../stores/post';

export class RepostCommand extends BaseCommand {
	public schema = repostSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<Repost>): Promise<VerificationResult> {
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

	public async execute(context: CommandExecuteContext<Repost>): Promise<void> {
		const { params, transaction } = context;
		const { postId } = params;

		const postIdBuffer = Buffer.from(postId, 'hex');
		const postStore = this.stores.get(PostStore);
		const accountStore = this.stores.get(AccountStore);

		// Get Sender
		const sender = await accountStore.getOrDefault(context, transaction.senderAddress);
		const post = await postStore.get(context, postIdBuffer);

		post.reposts.push(transaction.senderAddress);
		sender.post.posts.push(postId);

		await postStore.set(context, postIdBuffer, post);
		await accountStore.set(context, transaction.senderAddress, sender);
	}
}

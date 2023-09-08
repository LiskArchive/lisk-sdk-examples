import {
	BaseCommand,
	CommandExecuteContext,
	CommandVerifyContext,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { Reply } from '../types';
import { AccountStore } from '../stores/account';
import { replySchema } from '../schemas';
import { PostStore } from '../stores/post';

export class ReplyCommand extends BaseCommand {
	public schema = replySchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<Reply>): Promise<VerificationResult> {
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

	public async execute(context: CommandExecuteContext<Reply>): Promise<void> {
		const { params, transaction, header } = context;
		const { postId, content } = params;

		const postIdBuffer = Buffer.from(postId, 'hex');
		const postStore = this.stores.get(PostStore);
		const accountStore = this.stores.get(AccountStore);

		// Get Sender
		const sender = await accountStore.getOrDefault(context, transaction.senderAddress);

		const post = await postStore.get(context, postIdBuffer);

		const reply = {
			author: sender.address,
			date: header.timestamp,
			content,
		};

		const replyId = post.replies.length.toString();

		post.replies.push(reply);

		sender.post.replies.push(`${postId}#${replyId}`);

		await postStore.set(context, postIdBuffer, post);
		await accountStore.set(context, transaction.senderAddress, sender);
	}
}

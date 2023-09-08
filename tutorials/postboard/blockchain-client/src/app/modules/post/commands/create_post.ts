import {
	cryptography,
	BaseCommand,
	CommandExecuteContext,
	CommandVerifyContext,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { createPostSchema } from '../schemas';
import { CreatePost } from '../types';
import { AccountStore } from '../stores/account';
import { PostStore } from '../stores/post';
import { AllPostsStore } from '../stores/all_posts';

const getIDForPost = (address: Buffer, nonce: bigint): Buffer => {
	const nonceBuffer = Buffer.alloc(8);
	nonceBuffer.writeBigInt64LE(nonce);
	const seed = Buffer.concat([address, nonceBuffer]);
	return cryptography.utils.hash(seed);
};

export class CreatePostCommand extends BaseCommand {
	public schema = createPostSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(_context: CommandVerifyContext<CreatePost>): Promise<VerificationResult> {
		return {
			status: VerifyStatus.OK,
		};
	}

	public async execute(context: CommandExecuteContext<CreatePost>): Promise<void> {
		const { params, transaction, header } = context;
		const accountStore = this.stores.get(AccountStore);
		const senderProps = await accountStore.getOrDefault(context, transaction.senderAddress);

		const postId = getIDForPost(transaction.senderAddress, transaction.nonce);

		const post = {
			id: postId.toString('hex'),
			content: params.message,
			date: header.timestamp,
			author: transaction.senderAddress,
			replies: [],
			reposts: [],
			likes: [],
		};

		// Save post in the DB
		await this.stores.get(PostStore).set(context, postId, post);

		// Save postID to allPosts list
		const allPostsStore = this.stores.get(AllPostsStore);
		const allPosts = await allPostsStore.getAllPosts(context);
		allPosts.posts.push(postId.toString('hex'));
		await allPostsStore.setAllPosts(context, allPosts);

		// Save postID in users account
		senderProps.post.posts.push(postId.toString('hex'));
		await accountStore.set(context, transaction.senderAddress, senderProps);
	}
}

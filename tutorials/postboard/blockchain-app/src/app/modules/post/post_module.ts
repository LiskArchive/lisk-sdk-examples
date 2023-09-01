import { BaseModule, ModuleMetadata } from 'lisk-sdk';
import {
	accountSchema,
	allPostsSchema,
	getLatestPostsSchema,
	getPostSchema,
	postSchema,
} from './schemas';
import { PostEndpoint } from './endpoint';
import { PostMethod } from './method';
import { CreatePostCommand } from './commands/create_post';
import { PostStore } from './stores/post';
import { AllPostsStore } from './stores/all_posts';
import { AccountStore } from './stores/account';
import { FollowCommand } from './commands/follow';
import { LikeCommand } from './commands/like';
import { ReplyCommand } from './commands/reply';
import { RepostCommand } from './commands/repost';

export class PostModule extends BaseModule {
	public endpoint = new PostEndpoint(this.stores, this.offchainStores);
	public method = new PostMethod(this.stores, this.events);

	public commands = [
		new CreatePostCommand(this.stores, this.events),
		new FollowCommand(this.stores, this.events),
		new LikeCommand(this.stores, this.events),
		new ReplyCommand(this.stores, this.events),
		new RepostCommand(this.stores, this.events),
	];

	public constructor() {
		super();
		this.stores.register(PostStore, new PostStore(this.name, 0));
		this.stores.register(AllPostsStore, new AllPostsStore(this.name, 1));
		this.stores.register(AccountStore, new AccountStore(this.name, 2));
	}

	public metadata(): ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [
				{
					name: this.endpoint.getPost.name,
					request: getPostSchema,
					response: postSchema,
				},
				{
					name: this.endpoint.getLatestPosts.name,
					request: getLatestPostsSchema,
					response: allPostsSchema,
				},
				{
					name: this.endpoint.getAccount.name,
					request: getLatestPostsSchema,
					response: accountSchema,
				},
			],
			assets: [],
		};
	}
}

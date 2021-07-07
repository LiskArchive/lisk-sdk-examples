import { BaseIPCClientCommand } from 'lisk-commander';

export class LNSResolveCommand extends BaseIPCClientCommand {
	static args = [
		{
			name: 'name',
			required: true,
			description: 'Name to resolve.',
		},
	];

	static examples = ['lns:resolve jhon.lisk', 'lns:resolve jhon.lisk --pretty'];

	public async run(): Promise<void> {
		const { args } = this.parse(LNSResolveCommand);
		const { name } = args as { name: string };

		const result = await this._client?.invoke('lns:resolveName', { name });

		if (result) {
			return this.printJSON(result);
		}

		return this.log(`Can not resolve name "${name}"`);
	}
}

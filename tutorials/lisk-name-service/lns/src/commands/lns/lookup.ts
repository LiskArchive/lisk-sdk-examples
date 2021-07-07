import { BaseIPCClientCommand } from 'lisk-commander';

export class LNSLookupCommand extends BaseIPCClientCommand {
	static args = [
		{
			name: 'address',
			required: true,
			description: 'Address to lookup',
		},
	];

	static examples = ['lns:lookup <hex-address>', 'lns:lookup afe179fa12a988c1244444479c --pretty'];

	public async run(): Promise<void> {
		const { args } = this.parse(LNSLookupCommand);
		const { address } = args as { address: string };

		if (address !== Buffer.from(address, 'hex').toString('hex')) {
			this.error('Invalid address format');
		}

		const result = await this._client?.invoke('lns:lookupAddress', { address });

		if (result) {
			return this.printJSON(result);
		}

		return this.log(`Can not find account with address "${address}"`);
	}
}

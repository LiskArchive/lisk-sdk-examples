import { BaseCommand, CommandVerifyContext, VerificationResult, CommandExecuteContext } from 'lisk-sdk';

interface Params { }

export class TestCommand extends BaseCommand {
  // Define schema for asset
	public schema = {
		$id: 'hello/test-asset',
		title: 'TestCommand transaction asset for hello module',
		type: 'object',
		required: [],
		properties: {},
	};

	public async verify(context: CommandVerifyContext<Params>): Promise <VerificationResult> {
		// Validate your asset
	}

    public async execute(context: CommandExecuteContext<Params>): Promise <void> {
		throw new Error('Command "test" execute hook is not implemented.');
	}
}

import {
	BaseCommand,
	CommandVerifyContext,
	VerificationResult,
	CommandExecuteContext,
} from 'lisk-sdk';
import { VerifyStatus } from 'lisk-framework';
import { reverseLookupCommandParamsSchema } from '../schemas';
import { ReverseLookupCommandParams } from '../types';
import { LNSAccountStore } from '../stores/lnsAccount';
import { getNodeForName } from '../stores/lnsNode';

export class ReverseLookupCommand extends BaseCommand {
  // Define schema for command
	public schema = reverseLookupCommandParamsSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<ReverseLookupCommandParams>): Promise<VerificationResult> {
		const chunks = context.params.name.split(/\./);

		if (chunks.length > 2) {
			return {
				status: VerifyStatus.FAIL,
				error: new Error('You can only register second level domain name.')
			}
		}
		return {
			status: VerifyStatus.OK,
		}
	}

	public async execute(context: CommandExecuteContext<ReverseLookupCommandParams>): Promise<void> {
		const node = getNodeForName(context.params.name);

    // Get the sender account
		const lnsAccountSubStore = this.stores.get(LNSAccountStore);
		const lnsAccountExist = await lnsAccountSubStore.has(context, context.transaction.senderAddress);

		if (lnsAccountExist) {
			const sender = await lnsAccountSubStore.get(context, context.transaction.senderAddress);
			const senderOwns = sender.lns.ownNodes.find(n => n.equals(node));

			if (!senderOwns) {
				throw new Error('You can only assign lookup node which you own.');
			}

			sender.lns.reverseLookup = node;
			await lnsAccountSubStore.set(context, context.transaction.senderAddress, sender);

		} else {
			throw new Error('Account does not exist.');
		}
	}
}

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { reverseLookupCommandParamsSchema } from '../schemas';
import { ReverseLookupCommandParams } from '../types';
import { LNSAccountStore } from '../stores/lnsAccount';
import { getNodeForName } from '../stores/lnsNode';

export class ReverseLookupCommand extends BaseCommand {
	public schema = reverseLookupCommandParamsSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(_context: CommandVerifyContext<ReverseLookupCommandParams>): Promise<VerificationResult> {
		return { status: VerifyStatus.OK };
	}

	public async execute(context: CommandExecuteContext<ReverseLookupCommandParams>): Promise<void> {
		const node = getNodeForName(context.params.name);

    // Get the sender account
		const lnsAccountSubStore = this.stores.get(LNSAccountStore);
		const sender = await lnsAccountSubStore.get(context, context.transaction.senderAddress);

    // Check if this domain is already registered on the blockchain
    const senderOwns = sender.lns.ownNodes.find(n => n.equals(node));
    if (!senderOwns) {
        throw new Error('You can only assign lookup node which you own.');
    }

    // Save the updated sender account on the blockchain
    sender.lns.reverseLookup = node;
    await lnsAccountSubStore.set(context, context.transaction.senderAddress, sender);
	}
}

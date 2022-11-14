import {
	BaseCommand,
	CommandVerifyContext,
	VerificationResult,
	CommandExecuteContext,
} from 'lisk-sdk';
import { addYears } from 'date-fns';
import { RegisterCommandParams } from '../types';
import { registerCommandParamsSchema } from '../schemas';
import { MIN_TTL_VALUE, VALID_TLDS } from '../constants';
import { LNSAccountStore } from '../stores/lnsAccount';
import { getNodeForName, LNSNodeStore } from '../stores/lnsNode';

export class RegisterCommand extends BaseCommand {
  // Define schema for command parameters
	public schema = registerCommandParamsSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<RegisterCommandParams>): Promise<VerificationResult> {
		if (context.params.ttl < MIN_TTL_VALUE) {
			return {
				status: -1,
				error: new Error(`Must set TTL value larger or equal to ${MIN_TTL_VALUE}`)
			}
		}

		if (context.params.registerFor < 1) {
			return {
				status: -1,
				error: new Error('You can register name at least for 1 year.')
			}
		}

		if (context.params.registerFor > 5) {
			return {
				status: -1,
				error: new Error('You can register name maximum for 5 year.')
			}
		}

		const chunks = context.params.name.split(/\./);

		if (chunks.length > 2) {
			return {
				status: -1,
				error: new Error('You can only register second level domain name.')
			}
		}

		if (!VALID_TLDS.includes(chunks[1])) {
			return {
				status: -1,
				error: new Error(`Invalid TLD found "${chunks[1]}". Valid TLDs are "${VALID_TLDS.join()}"`)
			}
		}
		return {
			status: 1,
		}
	}

	public async execute(context: CommandExecuteContext<RegisterCommandParams>): Promise <void> {
		// Get namehash output of the domain name
		const node = getNodeForName(context.params.name);
		context.logger.info(' => REGISTER: node', node.toString('hex'));

		// Check if this domain is already registered on the blockchain
		const lnsNodeSubStore = this.stores.get(LNSNodeStore);
		const domainExists = await lnsNodeSubStore.has(context, node);
		context.logger.info(' => REGISTER: exists', JSON.stringify(domainExists));
		if (domainExists) {
				throw new Error(`The name "${context.params.name}" already registered`);
		}

		// Create the LNS object and save it on the blockchain
		const lnsObject = {
				name: context.params.name,
				ttl: context.params.ttl,
				expiry: Math.ceil(addYears(new Date(), context.params.registerFor).getTime() / 1000),
				ownerAddress: context.transaction.senderAddress,
				records: [],
		};
		await lnsNodeSubStore.createLNSObject(context, lnsObject);

		context.logger.info(' ======> REGISTER: TX sender ',  context.transaction.senderAddress.toString('hex'));
		// Get the sender account
		const lnsAccountSubStore = this.stores.get(LNSAccountStore);
		let sender;
		try {
			sender = await lnsAccountSubStore.get(context, context.transaction.senderAddress);
			sender.lns.ownNodes = [...sender.lns.ownNodes, node];
			await lnsAccountSubStore.set(context, context.transaction.senderAddress, sender);
		} catch (e) {
			context.logger.info(' ======> REGISTER: User did not exist ');

			await lnsAccountSubStore.set(context, context.transaction.senderAddress, {
				lns: {
					ownNodes: [node],
					reverseLookup: Buffer.alloc(0),
				}
			});
		}
	}
}

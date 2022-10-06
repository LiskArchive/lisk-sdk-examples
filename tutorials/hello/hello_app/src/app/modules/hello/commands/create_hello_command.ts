import { BaseCommand, CommandVerifyContext, VerificationResult, CommandExecuteContext } from 'lisk-sdk';
import { MessageStore } from '../stores/message';
import { CounterStore, counterStoreSchema } from '../stores/counter';
import { VerifyStatus } from 'lisk-framework/dist-node/state_machine/types';

interface Params {
	message: string;
}

export class CreateHelloCommand extends BaseCommand {
  // Define schema for asset
	public schema = {
		$id: 'hello/createHello-params',
		title: 'CreateHelloCommand transaction asset for hello module',
		type: 'object',
		required: ['message'],
		properties: {
			message: {
				dataType: 'string',
				fieldNumber: 1,
				minLength: 3,
				maxLength: 256,
			},
		},
	};

	public async verify(context: CommandVerifyContext<Params>): Promise <VerificationResult> {
		let validation: VerificationResult;
		context.logger.info("HELLO TX VERIFICATION");
		if (context.params.message === "Some illegal statement") {
			validation = {
				status: -1,
				error: new Error(
					'Illegal hello message: Some illegal statement'
				)
			};
		} else {
			validation = {
				status: 1
			};
		}
		return validation;
	}

    public async execute(context: CommandExecuteContext<Params>): Promise <void> {
			// 1. Get account data of the sender of the hello transaction
			const senderAddress = context.transaction.senderAddress;
			const messageSubstore = this.stores.get(MessageStore);
			const counterSubstore = this.stores.get(CounterStore);

			// 2. Update hello message in the senders account with thehelloString of the transaction asset
			await messageSubstore.set(context, context.transaction.senderAddress, {
				message: context.params.message,
			});

			// 3. Get the hello counter from the database
			const helloBuffer = Buffer.from('hello','utf8');
			const helloCounter = await counterSubstore.get(context, helloBuffer);


			// 5. Increment the hello counter +1
			helloCounter.counter++;

			// 6. Encode the hello counter and save it back to the database
			await counterSubstore.set(context, helloBuffer, helloCounter);
	}
}

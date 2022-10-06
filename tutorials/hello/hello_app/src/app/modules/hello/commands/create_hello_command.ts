import { BaseCommand, CommandVerifyContext, VerificationResult, CommandExecuteContext } from 'lisk-sdk';
import { MessageStore } from '../stores/message';
import { CounterStore, CounterStoreData } from '../stores/counter';

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
			const {senderAddress} = context.transaction;
			context.logger.info("====== this.stores.get(MessageStore) ======");
			const messageSubstore = this.stores.get(MessageStore);
			context.logger.info("====== this.stores.get(CounterStore) ======");
			const counterSubstore = this.stores.get(CounterStore);

			// 2. Update hello message in the senders account with the helloString of the transaction asset
			await messageSubstore.set(context, senderAddress, {
				message: context.params.message,
			});

			// 3. Get the hello counter from the database
			const helloBuffer = Buffer.from('hello','utf8');
			context.logger.info("====== counterSubstore.get(context, helloBuffer) ======");
			context.logger.info(helloBuffer);
			let helloCounter: CounterStoreData;
			try {
				helloCounter = await counterSubstore.get(context, helloBuffer);
			} catch (error) {
				context.logger.info("====== " + error + " ======");
				helloCounter = {
					counter: 0,
				}
			}

			context.logger.info("====== helloCounter ======");
			context.logger.info(helloCounter);
			context.logger.info("====== helloCounter ======");
			// 5. Increment the hello counter +1
			helloCounter.counter+=1;

			// 6. Encode the hello counter and save it back to the database
			await counterSubstore.set(context, helloBuffer, helloCounter);
	}
}

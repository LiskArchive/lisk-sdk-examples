/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { createHelloSchema } from '../schema';
import { MessageStore } from '../stores/message';
import { CounterStore, CounterStoreData } from '../stores/counter';

/* import { ModuleConfigJSON } from '../types';
import { validator } from '@liskhq/lisk-validator';
import { defaultConfig } from '../module'; */

interface Params {
	message: string;
}

export class CreateHelloCommand extends BaseCommand {
	public schema = createHelloSchema;
	private _blacklist!: string[];

	// eslint-disable-next-line @typescript-eslint/require-await
	public async init(blacklist: string[], maxLength: number, minLength: number): Promise<void> {
		this._blacklist = blacklist;
		this.schema.properties.message.maxLength = maxLength;
		this.schema.properties.message.minLength = minLength;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<Params>): Promise<VerificationResult> {
		let validation: VerificationResult;
		context.logger.info("HELLO TX VERIFICATION");
		const wordList = context.params.message.split(" ");
		context.logger.info(wordList,"wordList");
		context.logger.info(this._blacklist,"this._blacklist");
		const found = this._blacklist.filter(value => wordList.includes(value));
		if (found.length > 0) {
		  context.logger.info("======FOUND============");
			validation = {
				status: VerifyStatus.FAIL,
				error: new Error(
					`Illegal word in hello message: ${  found.toString()}`
				)
			};
		} else {
		  context.logger.info("======NOT FOUND============");
			validation = {
				status: VerifyStatus.OK
			};
		}
		context.logger.info("==================");
		context.logger.info(validation,"validation");
		return validation;
	}

	public async execute(context: CommandExecuteContext<Params>): Promise<void> {
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
		context.logger.info(helloBuffer,"====== counterSubstore.get(context, helloBuffer) ======");
		let helloCounter: CounterStoreData;
		try {
			helloCounter = await counterSubstore.get(context, helloBuffer);
		} catch (error) {
			context.logger.info(error,"====== ERROR ======");
			helloCounter = {
				counter: 0,
			}
		}
		// 5. Increment the hello counter +1
		helloCounter.counter+=1;
		context.logger.info("====== helloCounter ======");
		context.logger.info(helloCounter);
		context.logger.info("====== helloCounter ======");

		// 6. Encode the hello counter and save it back to the database
		await counterSubstore.set(context, helloBuffer, helloCounter);
	}
}

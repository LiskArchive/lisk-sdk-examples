/* eslint-disable class-methods-use-this */

import {
    BaseModule, BlockAfterExecuteContext, BlockExecuteContext, BlockVerifyContext,
    GenesisBlockExecuteContext, InsertAssetContext, ModuleInitArgs,
    ModuleMetadata, TransactionExecuteContext, TransactionVerifyContext,
    VerificationResult, codec, utils
} from 'lisk-sdk';
import { validator } from '@liskhq/lisk-validator';
import { CreateHelloCommand } from "./commands/create_hello_command";
import { createHelloSchema, CreateHelloParams, configSchema } from './schema';
import { ModuleConfigJSON } from './types';
import { HelloEndpoint } from './endpoint';
import { NewHelloEvent } from './events/new_hello';
import { HelloMethod } from './method';
import { CounterStore } from './stores/counter';
import { MessageStore } from './stores/message';

export const defaultConfig = {
	blacklist: ["illegalWord1"],
	maxMessageLength: 256,
	minMessageLength: 3
};

export class HelloModule extends BaseModule {
    public endpoint = new HelloEndpoint(this.stores, this.offchainStores);
    public method = new HelloMethod(this.stores, this.events);
	  public commands = [new CreateHelloCommand(this.stores, this.events)];

	  private _blacklist: string[] = [];



	public constructor() {
		super();
		// registeration of stores and events
		this.stores.register(CounterStore, new CounterStore(this.name));
		this.stores.register(MessageStore, new MessageStore(this.name));
		this.events.register(NewHelloEvent, new NewHelloEvent(this.name));
	}

	public metadata(): ModuleMetadata {
		return {
			name: this.name,
			endpoints: [],
			commands: this.commands.map(command => ({
				name: command.name,
				params: command.schema,
			})),
			events: this.events.values().map(v => ({
				name: v.name,
				data: v.schema,
			})),
			assets: [],
		};
	}

    // Lifecycle hooks
	  // eslint-disable-next-line @typescript-eslint/require-await
    public async init(args: ModuleInitArgs): Promise<void> {
			const { moduleConfig, genesisConfig } = args;
			console.log("moduleConfig: ", moduleConfig);
			console.log("genesisConfig: ", genesisConfig);
			const config = utils.objects.mergeDeep({}, defaultConfig, moduleConfig) as ModuleConfigJSON;
			console.log("===================================");
			console.log("config: ", config);
			validator.validate(configSchema, config);
			console.log("===================================");

			this._blacklist = config.blacklist;
			console.log("============== config.maxMessageLength: ",config.maxMessageLength);
			console.log("============== config.minMessageLength: ",config.minMessageLength);
			console.log("============== createHelloSchema.properties.message.maxLength: ", createHelloSchema.properties.message.maxLength);
			console.log("=======BEFORE======= createHelloSchema.properties.message.minLength: ", createHelloSchema.properties.message.minLength);
			this.commands[0].schema.properties.message.maxLength = config.maxMessageLength;
			this.commands[0].schema.properties.message.minLength = config.minMessageLength;
			console.log("======AFTER======== createHelloSchema.properties.message.maxLength: ", createHelloSchema.properties.message.maxLength);
			console.log("========AFTER====== createHelloSchema.properties.message.minLength: ", createHelloSchema.properties.message.minLength);
			this.commands[0].init(this._blacklist,config.maxMessageLength,config.minMessageLength).then(res => {
				console.log("Result: ", res);
			}).catch(err => {
				console.log("Error: ", err);
			});

	}


	public async insertAssets(_context: InsertAssetContext) {
		// initialize block generation, add asset
	}

	public async verifyAssets(_context: BlockVerifyContext): Promise<void> {
		// verify block
	}

    // Lifecycle hooks
	public async verifyTransaction(context: TransactionVerifyContext): Promise<VerificationResult> {
		// verify transaction will be called multiple times in the transaction pool
		context.logger.info("TX VERIFICATION");
		const result = {
			status: 1
		}
		return result;
	}

	public async beforeCommandExecute(_context: TransactionExecuteContext): Promise<void> {
	}

	public async afterCommandExecute(context: TransactionExecuteContext): Promise<void> {
		const newHelloEvent = this.events.get(NewHelloEvent);
		const createHelloParams: CreateHelloParams = codec.decode<CreateHelloParams>(createHelloSchema, context.transaction.params);
		context.logger.info(createHelloParams,"createHelloParams")
		newHelloEvent.log(context.getMethodContext(), {
			senderAddress: context.transaction.senderAddress,
			message: createHelloParams.message
		});

	}
	public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {

	}

	public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {

	}

	public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {

	}

	public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {

	}
}

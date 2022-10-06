/* eslint-disable class-methods-use-this */

import {
    BaseModule, BlockAfterExecuteContext, BlockExecuteContext, BlockVerifyContext, GenesisBlockExecuteContext,
	InsertAssetContext, ModuleInitArgs, ModuleMetadata, TransactionExecuteContext, TransactionVerifyContext, VerificationResult
} from 'lisk-sdk';
import { CreateHelloCommand } from "./commands/create_hello_command";
import { HelloEndpoint } from './endpoint';
import { HelloMethod } from './method';
import { CounterStore } from './stores/counter';
import { MessageStore } from './stores/message';

export class HelloModule extends BaseModule {
    public endpoint = new HelloEndpoint(this.stores, this.offchainStores);
    public method = new HelloMethod(this.stores, this.events);
    public commands = [new CreateHelloCommand(this.stores,
			this.events)];

	public constructor() {
		super();
		this.stores.register(CounterStore, new CounterStore(this.name));
		this.stores.register(MessageStore, new MessageStore(this.name));
	}

	public metadata(): ModuleMetadata {
		return {
			endpoints: [],
			commands: this.commands.map(command => ({
				name: command.name,
				params: command.schema,
			})),
			events: this.events.values().map(v => ({
				typeID: v.name,
				data: v.schema,
			})),
			assets: [],
		};
	}

    // Lifecycle hooks
    public async init(_args: ModuleInitArgs): Promise<void> {
		// initialize this module when starting a node
	}

	public async insertAssets(_context: InsertAssetContext) {
		// initialize block generation, add asset
	}

	public async verifyAssets(_context: BlockVerifyContext): Promise<void> {
		// verify block
	}

    // Lifecycle hooks
	public async verifyTransaction(_context: TransactionVerifyContext): Promise<VerificationResult> {
		const result = {
			status: 1
		}
		return result;
	}

	public async beforeCommandExecute(_context: TransactionExecuteContext): Promise<void> {
	}

	public async afterCommandExecute(_context: TransactionExecuteContext): Promise<void> {

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

/* eslint-disable class-methods-use-this */

import {
	BaseModule, BlockVerifyContext, InsertAssetContext,
	ModuleInitArgs, ModuleMetadata, TransactionVerifyContext,
	VerificationResult,
} from 'lisk-sdk';
import { RegisterCommand } from "./commands/register_command";
import { ReverseLookupCommand } from "./commands/reverse_lookup_command";
import { UpdateRecordsCommand } from "./commands/update_records_command";
import { LnsEndpoint } from './endpoint';
import { LnsMethod } from './method';
import { LNSAccountStore } from './stores/lnsAccount';
import { LNSNodeStore } from './stores/lnsNode';
import { CommandProps } from './types';
import {
	lnsNodeJSONSchema,
	lookupAddressParamsSchema,
	resolveNameParamsSchema,
	resolveNodeParamsSchema,
} from './schemas';

const promise = new Promise<void>((resolve) => {
	resolve();
});

export declare enum VerifyStatus {
	FAIL = -1,
	OK = 1,
	PENDING = 0
}

export class LnsModule extends BaseModule {
	public endpoint = new LnsEndpoint(this.stores, this.offchainStores);
	public method = new LnsMethod(this.stores, this.events);
	public commands = [
		new RegisterCommand(this.stores, this.events),
		new UpdateRecordsCommand(this.stores, this.events),
		new ReverseLookupCommand(this.stores, this.events),
	];

	public constructor() {
		super();
		this.stores.register(LNSNodeStore, new LNSNodeStore(this.name));
		this.stores.register(LNSAccountStore, new LNSAccountStore(this.name));
	}

	public metadata(): ModuleMetadata {
		return {
			name: 'Lns',
			endpoints: [
				{
					name: 'lookupAddress',
					request: lookupAddressParamsSchema,
					response: lnsNodeJSONSchema,
				},
				{
					name: 'resolveName',
					request: resolveNameParamsSchema,
					response: lnsNodeJSONSchema,
				},
				{
					name: 'resolveNode',
					request: resolveNodeParamsSchema,
					response: lnsNodeJSONSchema,
				}
			],
			commands: this.commands.map((command: CommandProps) => ({
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
		let status = VerifyStatus.PENDING;
		await promise.then(() => {
			status = VerifyStatus.OK;
		});
		return {
			status,
		};
	}

	// public async beforeCommandExecute(_context: TransactionExecuteContext): Promise<void> {}

	// public async afterCommandExecute(_context: TransactionExecuteContext): Promise<void> {}
	
	// public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

	// public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {}

	// public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {}

	// public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {}
}

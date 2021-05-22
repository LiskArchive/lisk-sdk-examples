/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

import {
	AfterBlockApplyContext,
	AfterGenesisBlockApplyContext,
	BaseModule,
	BeforeBlockApplyContext,
	codec,
	GenesisConfig,
	StateStore,
	TransactionApplyContext,
} from 'lisk-sdk';
import { RegisterAsset } from './assets/register';
import { UpdateRecordsAsset } from './assets/update_records';
import { ReverseLookupAsset } from './assets/reverse_lookup';
import { LNSNode, LNSNodeJSON, lnsNodeSchema, lsnAccountPropsSchema } from './data';
import { lookupAddress, resolveName, resolveNode } from './storage';

export class LnsModule extends BaseModule {
	public actions = {
		lookupAddress: async (params: Record<string, unknown>): Promise<LNSNodeJSON> => {
			const lnsObject = await lookupAddress({
				accountGetter: this._dataAccess.getAccountByAddress.bind(this),
				chainGetter: this._dataAccess.getChainState.bind(this),
				address: Buffer.from((params as { address: string }).address, 'hex'),
			});

			return codec.toJSON(lnsNodeSchema, lnsObject);
		},
		resolveName: async (params: Record<string, unknown>): Promise<LNSNodeJSON> => {
			const lnsObject = await resolveName({
				chainGetter: this._dataAccess.getChainState.bind(this),
				name: (params as { name: string }).name,
			});

			return codec.toJSON(lnsNodeSchema, lnsObject);
		},
		resolveNode: async (params: Record<string, unknown>): Promise<LNSNodeJSON> => {
			const lnsObject = await resolveNode({
				chainGetter: this._dataAccess.getChainState.bind(this),
				node: Buffer.from((params as { node: string }).node, 'hex'),
			});

			return codec.toJSON(lnsNodeSchema, lnsObject);
		},
	};
	public reducers = {
		lookupAddress: async (
			params: Record<string, unknown>,
			stateStore: StateStore,
		): Promise<LNSNode> =>
			lookupAddress({
				accountGetter: stateStore.account.get.bind(this),
				chainGetter: stateStore.chain.get.bind(this),
				address: (params as { address: Buffer }).address,
			}),
		resolveName: async (
			params: Record<string, unknown>,
			stateStore: StateStore,
		): Promise<LNSNode> =>
			resolveName({
				chainGetter: stateStore.chain.get.bind(this),
				name: (params as { name: string }).name,
			}),
		resolveNode: async (
			params: Record<string, unknown>,
			stateStore: StateStore,
		): Promise<LNSNode> =>
			resolveNode({
				chainGetter: stateStore.chain.get.bind(this),
				node: (params as { node: Buffer }).node,
			}),
	};
	public name = 'lns';
	public transactionAssets = [
		new RegisterAsset(),
		new ReverseLookupAsset(),
		new UpdateRecordsAsset(),
	];
	public accountSchema = lsnAccountPropsSchema;
	public events = [
		// Example below
		// 'lns:newBlock',
	];
	public id = 1000;

	public constructor(genesisConfig: GenesisConfig) {
		super(genesisConfig);
	}

	// Lifecycle hooks
	public async beforeBlockApply(_input: BeforeBlockApplyContext) {
		// Get any data from stateStore using block info, below is an example getting a generator
		// const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
	}

	public async afterBlockApply(_input: AfterBlockApplyContext) {
		// Get any data from stateStore using block info, below is an example getting a generator
		// const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
	}

	public async beforeTransactionApply(_input: TransactionApplyContext) {
		// Get any data from stateStore using transaction info, below is an example
		// const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
	}

	public async afterTransactionApply(_input: TransactionApplyContext) {
		// Get any data from stateStore using transaction info, below is an example
		// const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		// Get any data from genesis block, for example get all genesis accounts
		// const genesisAccounts = genesisBlock.header.asset.accounts;
	}
}

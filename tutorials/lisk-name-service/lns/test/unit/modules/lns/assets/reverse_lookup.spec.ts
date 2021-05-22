import { chain, cryptography, StateStore, testing } from 'lisk-sdk';
import { ReverseLookupAsset } from '../../../../../src/app/modules/lns/assets/reverse_lookup';
import { LNSAccountProps } from '../../../../../src/app/modules/lns/data';
import { LnsModule } from '../../../../../src/app/modules/lns/lns_module';
import { getNodeForName } from '../../../../../src/app/modules/lns/storage';

describe('ReverseLookupAsset', () => {
	let transactionAsset: ReverseLookupAsset;

	beforeEach(() => {
		transactionAsset = new ReverseLookupAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(2);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('reverse-lookup');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('apply', () => {
		let stateStore: StateStore;
		let account: chain.Account<LNSAccountProps>;
		let ownNodes: Buffer[];

		beforeEach(() => {
			ownNodes = [getNodeForName('john.lsk'), getNodeForName('doe.lsk')];
			account = testing.fixtures.createDefaultAccount<LNSAccountProps>([LnsModule]);
			account.lns.ownNodes = ownNodes;

			stateStore = new testing.mocks.StateStoreMock({
				accounts: [account],
			});

			jest.spyOn(stateStore.chain, 'get');
			jest.spyOn(stateStore.chain, 'set');
		});

		describe('valid cases', () => {
			it('should update sender account lns reverse-lookup with given node if not already set', async () => {
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { name: 'john.lsk' },
					transaction: { senderAddress: account.address } as any,
				});
				await transactionAsset.apply(context);

				const updatedAccount = stateStore.account.get<LNSAccountProps>(account.address);

				expect((await updatedAccount).lns.reverseLookup).toEqual(ownNodes[0]);
			});

			it('should update sender account lns reverse-lookup with given node even if already set', async () => {
				account.lns.reverseLookup = cryptography.getRandomBytes(20);
				stateStore = new testing.mocks.StateStoreMock({
					accounts: [account],
				});
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { name: 'john.lsk' },
					transaction: { senderAddress: account.address } as any,
				});
				await transactionAsset.apply(context);

				const updatedAccount = stateStore.account.get<LNSAccountProps>(account.address);

				expect((await updatedAccount).lns.reverseLookup).toEqual(ownNodes[0]);
			});
		});

		describe('invalid cases', () => {
			it('should throw error if node to set-lookup is not owned by sender', async () => {
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { name: 'alpha.lsk' },
					transaction: { senderAddress: account.address } as any,
				});

				await expect(transactionAsset.apply(context)).rejects.toThrow(
					'You can only assign lookup node which you own.',
				);
			});
		});
	});
});

import { addYears } from 'date-fns';
import { StateStore, testing } from 'lisk-sdk';
import { RegisterAsset } from '../../../../../src/app/modules/lns/assets/register';
import { LNSAccountProps } from '../../../../../src/app/modules/lns/data';
import { LnsModule } from '../../../../../src/app/modules/lns/lns_module';
import {
	getKeyForNode,
	getLNSObject,
	getNodeForName,
} from '../../../../../src/app/modules/lns/storage';

describe('RegisterAsset', () => {
	let transactionAsset: RegisterAsset;

	beforeEach(() => {
		transactionAsset = new RegisterAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(1);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('register');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
			it('should throw error if ttl is set less than an hour', () => {
				const context = testing.createValidateAssetContext({
					asset: { name: 'nazar.hussain', ttl: 60 * 60 - 1, registerFor: 1 },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'Must set TTL value larger or equal to 3600',
				);
			});

			it('should throw error if name is registered for less than a year', () => {
				const context = testing.createValidateAssetContext({
					asset: { name: 'nazar.hussain', ttl: 60 * 60, registerFor: 0 },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You can register name at least for 1 year.',
				);
			});

			it('should throw error if name is registered for more than 5 years', () => {
				const context = testing.createValidateAssetContext({
					asset: { name: 'nazar.hussain', ttl: 60 * 60, registerFor: 6 },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'You can register name maximum for 5 year.',
				);
			});

			it('should throw error if domain contains invalid tld', () => {
				const context = testing.createValidateAssetContext({
					asset: { name: 'nazar.hussain', ttl: 60 * 60, registerFor: 1 },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).toThrow(
					'Invalid TLD found "hussain". Valid TLDs are "lsk"',
				);
			});

			it('should be ok for valid schema', () => {
				const context = testing.createValidateAssetContext({
					asset: { name: 'nazar.lsk', ttl: 60 * 60, registerFor: 1 },
					transaction: { senderAddress: Buffer.alloc(0) } as any,
				});

				expect(() => transactionAsset.validate(context)).not.toThrow();
			});
		});
	});

	describe('apply', () => {
		let stateStore: StateStore;
		let account: any;

		beforeEach(() => {
			account = testing.fixtures.createDefaultAccount<LNSAccountProps>([LnsModule]);

			stateStore = new testing.mocks.StateStoreMock({
				accounts: [account],
			});

			jest.spyOn(stateStore.chain, 'get');
			jest.spyOn(stateStore.chain, 'set');
		});

		describe('valid cases', () => {
			it('should update the state store with nameahsh key', async () => {
				const name = 'nazar.lsk';
				const node = getNodeForName(name);
				const key = getKeyForNode(node);
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { name: 'nazar.lsk', ttl: 60 * 60, registerFor: 1 },
					transaction: { senderAddress: account.address } as any,
				});
				await transactionAsset.apply(context);

				expect(stateStore.chain.set).toHaveBeenCalledWith(key, expect.any(Buffer));
			});

			it('should update the state store with updated sender account', async () => {
				const name = 'nazar.lsk';
				const node = getNodeForName(name);
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { name: 'nazar.lsk', ttl: 60 * 60, registerFor: 1 },
					transaction: { senderAddress: account.address } as any,
				});
				await transactionAsset.apply(context);

				const updatedSender = await stateStore.account.get<LNSAccountProps>(account.address);

				expect(updatedSender.lns.ownNodes).toEqual([node]);
			});

			it('should update the state store with correct ttl value', async () => {
				const name = 'nazar.lsk';
				const node = getNodeForName(name);
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { name: 'nazar.lsk', ttl: 60 * 70, registerFor: 1 },
					transaction: { senderAddress: account.address } as any,
				});
				await transactionAsset.apply(context);

				const lsnObject = await getLNSObject(stateStore, node);

				expect(lsnObject?.ttl).toEqual(60 * 70);
			});

			it('should update the state store with correct expiry date', async () => {
				const name = 'nazar.lsk';
				const node = getNodeForName(name);
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { name: 'nazar.lsk', ttl: 60 * 70, registerFor: 2 },
					transaction: { senderAddress: account.address } as any,
				});
				const expiryTimestamp = Math.ceil(addYears(new Date(), 2).getTime() / 1000);

				await transactionAsset.apply(context);

				const lsnObject = await getLNSObject(stateStore, node);

				expect(lsnObject?.expiry).toBeGreaterThanOrEqual(expiryTimestamp);
			});
		});

		describe('invalid cases', () => {
			it('should throw error if name is already registered', async () => {
				const context = testing.createApplyAssetContext({
					stateStore,
					asset: { name: 'nazar.lsk', ttl: 60 * 60, registerFor: 1 },
					transaction: { senderAddress: account.address } as any,
				});

				await transactionAsset.apply(context);

				await expect(transactionAsset.apply(context)).rejects.toThrow(
					'The name "nazar.lsk" already registered',
				);
			});
		});
	});
});

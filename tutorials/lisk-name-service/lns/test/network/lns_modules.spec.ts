import { cryptography, passphrase, testing, transactions } from 'lisk-sdk';
import { LnsModule } from '../../src/app/modules/lns/lns_module';

jest.setTimeout(150000);

describe('LnsModule', () => {
	let appEnv: testing.ApplicationEnv;

	beforeAll(async () => {
		appEnv = testing.createDefaultApplicationEnv({ modules: [LnsModule] });
		await appEnv.startApplication();
	});

	afterAll(async () => {
		jest.spyOn(process, 'exit').mockImplementation((() => {}) as never);
		await appEnv.stopApplication();
	});

	describe('actions', () => {
		describe('resolveName', () => {
			it('should throw error on resolving non-registered name', async () => {
				await expect(appEnv.ipcClient.invoke('lns:resolveName', { name: 'nazar' })).rejects.toThrow(
					'Name "nazar" could not resolve.',
				);
			});

			it('should resolve name after registration', async () => {
				// Create an account
				const accountPassphrase = passphrase.Mnemonic.generateMnemonic();
				const { address } = cryptography.getAddressAndPublicKeyFromPassphrase(accountPassphrase);
				const account = testing.fixtures.createDefaultAccount([LnsModule], { address });

				// Fund with some tokens
				let tx = await appEnv.ipcClient.transaction.create(
					{
						moduleName: 'token',
						assetName: 'transfer',
						asset: {
							recipientAddress: account.address,
							amount: BigInt(transactions.convertLSKToBeddows('100')),
							data: '',
						},
						fee: BigInt(transactions.convertLSKToBeddows('0.1')),
					},
					testing.fixtures.defaultFaucetAccount.passphrase,
				);
				await appEnv.ipcClient.transaction.send(tx);
				await appEnv.waitNBlocks(1);

				tx = await appEnv.ipcClient.transaction.create(
					{
						moduleName: 'lns',
						assetName: 'register',
						asset: {
							registerFor: 1,
							name: 'nazar.lsk',
							ttl: 36000,
						},
						fee: BigInt(transactions.convertLSKToBeddows('0.1')),
					},
					accountPassphrase,
				);
				await appEnv.ipcClient.transaction.send(tx);
				await appEnv.waitNBlocks(1);

				await expect(
					appEnv.ipcClient.invoke('lns:resolveName', { name: 'nazar.lsk' }),
				).resolves.toEqual(
					expect.objectContaining({
						name: 'nazar.lsk',
						ownerAddress: address.toString('hex'),
						ttl: 36000,
						records: [],
					}),
				);
			});
		});
	});
});

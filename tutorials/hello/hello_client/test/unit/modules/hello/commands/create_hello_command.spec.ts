import { NamedRegistry, testing, codec, cryptography, Transaction, chain, db, VerifyStatus } from 'lisk-sdk';
import { CreateHelloCommand } from '../../../../../src/app/modules/hello/commands/create_hello_command';
import { CreateHelloParams, createHelloSchema } from '../../../../../src/app/modules/hello/schema';
import { ModuleConfig } from '../../../../../src/app/modules/hello/types';

describe('CreateHelloCommand', () => {

	const getSampleTransaction = (params: Buffer) => ({
		module: 'hello',
		command: CreateHelloCommand.name,
		senderPublicKey: cryptography.utils.getRandomBytes(32),
		nonce: BigInt(0),
		fee: BigInt(100000000),
		params,
		signatures: [cryptography.utils.getRandomBytes(64)],
	});

	let command: CreateHelloCommand;
	let stateStore: any;

	const config = {
		"blacklist": [
			"illegalWord1",
			"badWord2",
			"censoredWord3"
		]
	}

	beforeEach(async () => {
		command = new CreateHelloCommand(new NamedRegistry(), new NamedRegistry());
		await command.init(config as ModuleConfig);
		stateStore = new chain.StateStore(new db.InMemoryDatabase());
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toBe('createHello');
		});

		it('should have valid schema', () => {
			expect(command.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		it('Illegal Message', async () => {
			const IllegalParam = codec.encode(createHelloSchema, { 'message': "badWord2" })
			const transaction = new Transaction(getSampleTransaction(IllegalParam));

			const context = testing
				.createTransactionContext({
					stateStore,
					transaction,
					header: testing.createFakeBlockHeader({}),
				})
				.createCommandVerifyContext<CreateHelloParams>(createHelloSchema);

			const result = await command.verify(context);
			expect(result.status).toBe(VerifyStatus.FAIL);
		});

		it('Legal Message', async () => {
			const LegalParam = codec.encode(createHelloSchema, { 'message': "Hello Lisk v6 " })
			const transaction = new Transaction(getSampleTransaction(LegalParam));

			const context = testing
				.createTransactionContext({
					stateStore,
					transaction,
					header: testing.createFakeBlockHeader({}),
				})
				.createCommandVerifyContext<CreateHelloParams>(createHelloSchema);

			const result = await command.verify(context);
			expect(result.status).toBe(VerifyStatus.OK);
		});
	});

	describe('execute', () => {
		it('Illegal Message', async () => {
			const IllegalParam = codec.encode(createHelloSchema, { 'message': "badWord2" })
			const transaction = new Transaction(getSampleTransaction(IllegalParam));

			const context = testing
				.createTransactionContext({
					stateStore,
					transaction,
					header: testing.createFakeBlockHeader({}),
				})
				.createCommandVerifyContext<CreateHelloParams>(createHelloSchema);

			const result = await command.verify(context);
			expect(result.status).toBe(VerifyStatus.FAIL);
		});

		it('Legal Message', async () => {
			const LegalParam = codec.encode(createHelloSchema, { 'message': "Hello Lisk v6 " })
			const transaction = new Transaction(getSampleTransaction(LegalParam));

			const context = testing
				.createTransactionContext({
					stateStore,
					transaction,
					header: testing.createFakeBlockHeader({}),
				})
				.createCommandVerifyContext<CreateHelloParams>(createHelloSchema);

			const result = await command.verify(context);
			expect(result.status).toBe(VerifyStatus.OK);
		});
	});
});

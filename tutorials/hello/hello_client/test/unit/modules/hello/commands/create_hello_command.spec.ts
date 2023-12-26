import { testing, codec, cryptography, Transaction, chain, db, VerifyStatus } from 'lisk-sdk';
import { CreateHelloCommand } from '../../../../../src/app/modules/hello/commands/create_hello_command';
import { CreateHelloParams, createHelloSchema } from '../../../../../src/app/modules/hello/schema';
import { ModuleConfig } from '../../../../../src/app/modules/hello/types';
import { HelloModule } from '../../../../../src/app/modules/hello/module';
import { CounterStore } from '../../../../../src/app/modules/hello/stores/counter';
import { MessageStore } from '../../../../../src/app/modules/hello/stores/message';

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
	let counterStore: CounterStore;
	let messageStore: MessageStore;
	// const hello = new HelloModule();

	const config = {
		"blacklist": [
			"illegalWord1",
			"badWord2",
			"censoredWord3"
		]
	}

	beforeEach(async () => {
		const hello = new HelloModule();
		command = new CreateHelloCommand(hello.stores, hello.events);
		await command.init(config as ModuleConfig);
		stateStore = new chain.StateStore(new db.InMemoryDatabase());
		counterStore = hello.stores.get(CounterStore);
		messageStore = hello.stores.get(MessageStore)
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
		it('Legal Message', async () => {
			const illegalMessage = { 'message': "badd2" };
			const illegalParam = codec.encode(createHelloSchema, illegalMessage)
			const transaction = new Transaction(getSampleTransaction(illegalParam));

			const context = testing
				.createTransactionContext({
					stateStore,
					transaction,
					header: testing.createFakeBlockHeader({}),
				})
				.createCommandExecuteContext<CreateHelloParams>(createHelloSchema);

			await command.execute(context);
			// "senderAddress": "lsk75zmxzxe73s5sp45a8ggtcq8aeqg2k4rbkwuof",
			const helloMessage = await messageStore.get(context, Buffer.from(cryptography.address.getAddressFromLisk32Address("lsk75zmxzxe73s5sp45a8ggtcq8aeqg2k4rbkwuof")));
			const helloCounter = await counterStore.get(context, Buffer.alloc(0));
			expect(helloCounter).toBe(0);
			expect(helloMessage).toBe("badd2");
		});

		// it('Legal Message', async () => {
		// 	const LegalParam = codec.encode(createHelloSchema, { 'message': "Hello Lisk v6 " })
		// 	const transaction = new Transaction(getSampleTransaction(LegalParam));

		// 	const context = testing
		// 		.createTransactionContext({
		// 			stateStore,
		// 			transaction,
		// 			header: testing.createFakeBlockHeader({}),
		// 		})
		// 		.createCommandExecuteContext<CreateHelloParams>(createHelloSchema);

		// 	await command.execute(context);
		// 	const helloCounter = await counterStore.get(context);
		// 	expect(helloCounter).toBe(1);
		// });
	});
});

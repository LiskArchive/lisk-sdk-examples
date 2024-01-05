import { testing, codec, cryptography, Transaction, chain, db, VerifyStatus } from 'lisk-sdk';
import { CreateHelloCommand } from '../../../../../src/app/modules/hello/commands/create_hello_command';
import { CreateHelloParams, createHelloSchema } from '../../../../../src/app/modules/hello/schema';
import { ModuleConfig } from '../../../../../src/app/modules/hello/types';
import { HelloModule } from '../../../../../src/app/modules/hello/module';
import { CounterStore, counterKey } from '../../../../../src/app/modules/hello/stores/counter';
import { MessageStore } from '../../../../../src/app/modules/hello/stores/message';

describe('CreateHelloCommand', () => {

	const getSampleTransaction = (params: Buffer) => ({
		module: 'hello',
		command: CreateHelloCommand.name,
		senderPublicKey: Buffer.from("3bb9a44b71c83b95045486683fc198fe52dcf27b55291003590fcebff0a45d9a", 'hex'),
		nonce: BigInt(0),
		fee: BigInt(100000000),
		params,
		signatures: [cryptography.utils.getRandomBytes(64)],
	});

	let command: CreateHelloCommand;
	let stateStore: any;
	let counterStore: CounterStore;
	let messageStore: MessageStore;

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
		messageStore = hello.stores.get(MessageStore);
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
		it('should return error and status VerifyStatus.FAIL', async () => {
			const illegalParam = codec.encode(createHelloSchema, { 'message': "badWord2" })
			const transaction = new Transaction(getSampleTransaction(illegalParam));

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

		it('should pass verify successfully and return status VerifyStatus.OK', async () => {
			const legalParam = codec.encode(createHelloSchema, { 'message': "Hello Lisk v6 " })
			const transaction = new Transaction(getSampleTransaction(legalParam));

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
		it('should execute successfully for a valid message and initialize and increment the counter to 1 when a counter doesn't exist', async () => {
			const message = { "message": "Hello from SDK!" };
			const params = codec.encode(createHelloSchema, message)
			const transaction = new Transaction(getSampleTransaction(params));

			const context = testing
				.createTransactionContext({
					stateStore,
					transaction,
					header: testing.createFakeBlockHeader({}),
				})
				.createCommandExecuteContext<CreateHelloParams>(createHelloSchema);

			await command.execute(context);
			const helloMessage = await messageStore.get(context, transaction.senderAddress);
			const helloCounter = await counterStore.get(context, counterKey);
			expect(helloCounter.counter).toBe(1);
			expect(helloMessage.message).toBe("Hello from SDK!");
		});

		it('should execute successfully for a valid message and increment the existing counter value', async () => {
			const message = { "message": "Hello from SDK!" };
			const params = codec.encode(createHelloSchema, message)
			const transaction = new Transaction(getSampleTransaction(params));

			const context = testing
				.createTransactionContext({
					stateStore,
					transaction,
					header: testing.createFakeBlockHeader({}),
				})
				.createCommandExecuteContext<CreateHelloParams>(createHelloSchema);
			await counterStore.set(context, counterKey, { "counter": 10 })
			await command.execute(context);
			const helloMessage = await messageStore.get(context, transaction.senderAddress);
			const helloCounter = await counterStore.get(context, counterKey);
			expect(helloCounter.counter).toBe(11);
			expect(helloMessage.message).toBe("Hello from SDK!");
		});
	});
});
import { CreateHelloAsset } from '../../../../../src/app/modules/hello/assets/create_hello_asset';
import { testing, StateStore, ReducerHandler, codec } from 'lisk-sdk';
import { HelloModule } from '../../../../../src/app/modules/hello/hello_module';

export interface HelloAccountProps {
    hello: {
        helloMessage: "Hello World";
    };
}
const CHAIN_STATE_HELLO_COUNTER = "hello:helloCounter";

const helloCounterSchema = {
    $id: "lisk/hello/counter",
    type: "object",
    required: ["helloCounter"],
    properties: {
        helloCounter: {
            dataType: "uint32",
            fieldNumber: 1,
        },
    },
};


describe('CreateHelloAsset', () => {
  let transactionAsset: CreateHelloAsset;

	beforeEach(() => {
		transactionAsset = new CreateHelloAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(0);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('createHello');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
            it('should throw error if nft name equals "Mewtwo"', () => {
                const context = testing.createValidateAssetContext({
                    asset: { helloString: 'Some illegal statement' },
                    transaction: { senderAddress: Buffer.alloc(0) } as any,
                });
                expect(() => transactionAsset.validate(context)).toThrow(
                    'Illegal hello message: Some illegal statement',
                );
            });
            it('should be ok for valid schema', () => {
                const context = testing.createValidateAssetContext({
                    asset: { helloString: 'Some valid statement' },
                    transaction: { senderAddress: Buffer.alloc(0) } as any,
                });

                expect(() => transactionAsset.validate(context)).not.toThrow();
            });
        });
	});

	describe('apply', () => {
        let stateStore: StateStore;
        let reducerHandler: ReducerHandler;
        let account: any;
        let context;
        let counter;

        beforeEach(() => {
            account = testing.fixtures.createDefaultAccount<HelloAccountProps>([HelloModule]);

            counter = 0;

            /*nftToken = createNFTToken({
                name: 'Squirtle',
                ownerAddress: account.address,
                nonce: BigInt(1),
                value: BigInt(1),
                minPurchaseMargin: 10
            });*/

            stateStore = new testing.mocks.StateStoreMock({
                accounts: [account],
                chain: { "hello:helloCounter": codec.encode(helloCounterSchema, counter)}
            });

            reducerHandler = testing.mocks.reducerHandlerMock;

            context = testing.createApplyAssetContext({
                stateStore,
                reducerHandler,
                asset: { helloString: 'Some statement' },
                transaction: { senderAddress: account.address, nonce: BigInt(1) } as any,
            });

            jest.spyOn(stateStore.chain, 'get');
            jest.spyOn(stateStore.chain, 'set');
            jest.spyOn(reducerHandler, 'invoke');
        });
        describe('valid cases', () => {
            it('should update sender account hello message', async () => {
                await transactionAsset.apply(context);
                const updatedSender = await stateStore.account.get<HelloAccountProps>(account.address);

                expect(updatedSender.hello.helloMessage).toEqual("Some statement");
            });
            it('should increment the hello counter by +1', async () => {
                /*await stateStore.chain.set(
                    CHAIN_STATE_HELLO_COUNTER,
                    codec.encode(helloCounterSchema, counter)
                );*/
                await transactionAsset.apply(context);

                expect(stateStore.chain.set).toHaveBeenCalledWith(
                    CHAIN_STATE_HELLO_COUNTER,
                    codec.encode(helloCounterSchema, counter+1)
                );
            });
        });

        describe('invalid cases', () => {
          it.todo('should throw error');
        });
	});
});

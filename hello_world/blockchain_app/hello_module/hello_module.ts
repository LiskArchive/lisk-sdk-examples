import {
    BaseModule,
    BeforeBlockApplyContext,
    AfterBlockApplyContext,
    AfterGenesisBlockApplyContext,
    TransactionApplyContext,
    GenesisConfig,
} from 'lisk-sdk';
import { HelloAsset } from './hello_asset';
import {
    CHAIN_STATE_HELLO_COUNTER
} from './schemas';

const x = new HelloAsset();

export class HelloModule extends BaseModule {
    name = 'hello';
    id = 1000;
    accountSchema = {
        type: 'object',
        properties: {
            hello: {
                fieldNumber: 1,
                dataType: 'string',
            },
        },
        default: {
            hello: '',
        },
    };
    transactionAssets = [ new HelloAsset() ];
    actions = {
        amountOfHellos: async () => {
            return await this._dataAccess.getChainState(CHAIN_STATE_HELLO_COUNTER);
        },
    };
    events = ['newHello'];
    reducers = {};
    async beforeTransactionApply({transaction, stateStore}: TransactionApplyContext): Promise<void> {
        // Code in here is applied before a transaction is applied.
    };

    async afterTransactionApply({transaction, stateStore}: TransactionApplyContext): Promise<void> {
        // Code in here is applied after a transaction is applied.
        this._channel.publish('hello:newHello', { sender: transaction.senderAddress, hello: transaction.hello });
    };
    async afterGenesisBlockApply(context: AfterGenesisBlockApplyContext): Promise<void> {
        // Code in here is applied after a genesis block is applied.
    };
    async beforeBlockApply(context: BeforeBlockApplyContext): Promise<void> {
        // Code in here is applied before a block is applied.
    }
    async afterBlockApply(context: AfterBlockApplyContext): Promise<void> {
        // Code in here is applied after a block is applied.
        this._channel.subscribe('app:chain:fork ', ({ data }) => {
            console.log(data);
        });
    }
}

module.exports = HelloModule;

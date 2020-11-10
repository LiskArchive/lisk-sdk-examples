const { BaseModule, codec } = require('lisk-sdk');
const HelloAsset = require('./hello_asset');
const {
    helloCounterSchema,
    newHelloSchema,
    CHAIN_STATE_HELLO_COUNTER
} = require('./schemas');

class HelloModule extends BaseModule {
    name = 'hello';
    id = 1000;
    accountSchema = {
        type: 'object',
        properties: {
            helloMessage: {
                fieldNumber: 1,
                dataType: 'string',
            },
        },
        default: {
            helloMessage: '',
        },
    };
    transactionAssets = [ new HelloAsset() ];
    actions = {
        amountOfHellos: async () => {
            const res = await this._dataAccess.getChainState(CHAIN_STATE_HELLO_COUNTER);
            const count = codec.decode(
                helloCounterSchema,
                res
            );
            return count;
        },
    };
    events = ['newHello'];
    reducers = {};
    async beforeTransactionApply({transaction, stateStore, reducerHandler}) {
        // Code in here is applied before a transaction is applied.
    };

    async afterTransactionApply({transaction, stateStore, reducerHandler}) {
        // Code in here is applied after a transaction is applied.
        this._channel.publish('hello:newHello', {
          sender: transaction._senderAddress.toString('hex'),
          hello: transaction.asset.toString('utf8')
        });
    };
    async afterGenesisBlockApply(context) {
        // Code in here is applied after a genesis block is applied.
    };
    async beforeBlockApply(context) {
        // Code in here is applied before a block is applied.
    }
    async afterBlockApply(context) {
        // Code in here is applied after a block is applied.
        /*this._channel.subscribe('app:chain:fork ', ({ data }) => {
            console.log(data);
        });*/
    }
}

module.exports = HelloModule;

const { BaseModule, codec } = require('lisk-sdk');
const { HelloAsset, HelloAssetID } = require('./hello_asset');
const {
    helloCounterSchema,
    helloAssetSchema,
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
        // Code in here is applied before each transaction is applied.
    };

    async afterTransactionApply({transaction, stateStore, reducerHandler}) {
      // Code in here is applied after each transaction is applied.
      if (transaction.moduleID === this.id && transaction.assetID === HelloAssetID) {

        const helloAsset = codec.decode(
          helloAssetSchema,
          transaction.asset
        );

        this._channel.publish('hello:newHello', {
          sender: transaction._senderAddress.toString('hex'),
          hello: helloAsset.helloString
        });
      }
    };
    async afterGenesisBlockApply({genesisBlock, stateStore, reducerHandler}) {
      // Set the hello counter to zero after the genesis block is applied
      console.log('stateStore');
      console.log(stateStore);
      await stateStore.chain.set(
        CHAIN_STATE_HELLO_COUNTER,
        codec.encode(helloCounterSchema, { helloCounter: 0 })
      );
    };
    async beforeBlockApply(context) {
        // Code in here is applied before each block is applied.
    }
    async afterBlockApply(context) {
        // Code in here is applied after each block is applied.
    }
}

module.exports = HelloModule;

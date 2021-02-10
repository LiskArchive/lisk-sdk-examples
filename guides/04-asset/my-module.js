const { BaseModule } = require('lisk-sdk');
const { myAccountSchema } = require('./schemas.js');
const { MyAsset } = require('./my-asset.js');

class MyModule extends BaseModule {
  id = 1024;
  name = 'myModule';
  accountSchema = myAccountSchema;
  transactionAssets = [ new MyAsset() ];
  actions = {
    myAction: async () => {
      // Returns some data
    },
    anotherAction: async (params) => {
      // Returns some other data
    }
  };
  events = ['myEvent','anotherEvent'];
  reducers = {
    myReducer: async (params, stateStore) => {
      // Returns some data
    },
    anotherReducer: async (params, stateStore) => {
      // Returns some other data
    }
  };

  async beforeTransactionApply({transaction, stateStore, reducerHandler}) {
    // Code in here is applied before each transaction is applied.
  };

  async afterTransactionApply({transaction, stateStore, reducerHandler}) {
    // Code in here is applied after each transaction is applied.
    if (transaction.moduleID === this.id && transaction.assetID === MyAssetID) {

      const myAsset = codec.decode(
        myAssetSchema,
        transaction.asset
      );

      this._channel.publish('my-module:myEvent', {
        sender: transaction._senderAddress.toString('hex')
      });
    }
  };
  async afterGenesisBlockApply({genesisBlock, stateStore, reducerHandler}) {
    // Code in here is applied after the genesis block is applied.
  };
  async beforeBlockApply({block, stateStore, reducerHandler}) {
    // Code in here is applied before each block is applied.
  }
  async afterBlockApply({block, stateStore, reducerHandler, consensus}) {
    // Code in here is applied after each block is applied.
  }
}

module.exports = { MyModule };

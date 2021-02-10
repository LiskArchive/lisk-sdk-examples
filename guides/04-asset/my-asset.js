const { BaseAsset } = require('lisk-sdk');
const { myAssetSchema } = require('./schemas');

class MyAsset extends BaseAsset {
  id = 0;
  name = 'myAsset';
  schema = myAssetSchema;

  validate({asset}) {
    if (!asset.key1 || typeof asset.key1 !== 'string' || asset.key1.length > 64) {
      throw new Error(
        'Invalid "asset.key1" defined on transaction: A string value no longer than 64 characters is expected'
      );
    }
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);

    senderAccount.myModule.key1 = asset.key1;
    stateStore.account.set(senderAccount.address, senderAccount);
  }
}

module.exports = { MyAsset };

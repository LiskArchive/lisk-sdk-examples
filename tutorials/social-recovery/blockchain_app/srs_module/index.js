const { BaseModule, codec } = require('lisk-sdk');
const  { CreateRecoveryAsset, CREATE_RECOVERY_ASSET_ID } = require('./assets/create_recovery');
const { InitiateRecoveryAsset, INITIATE_RECOVERY_ASSET_ID } = require('./assets/initiate_recovery');
const VouchRecovery = require('./assets/vouch_recovery');
const ClaimRecovery = require('./assets/claim_recovery');
const CloseRecovery = require('./assets/close_recovery');
const { RemoveRecoveryAsset, REMOVE_RECOVERY_ASSET_ID } = require('./assets/remove_recovery');
const { SRSAccountSchema, createRecoverySchema, initiateRecoverySchema } = require('./schemas');

// Extend from the base module to implement a custom module
class SRSModule extends BaseModule {
  name = 'srs';
  id = 1026;
  accountSchema = SRSAccountSchema;

  transactionAssets = [
    new CreateRecoveryAsset(),
    new InitiateRecoveryAsset(),
    new VouchRecovery(),
    new ClaimRecovery(),
    new CloseRecovery(),
    new RemoveRecoveryAsset(),
  ];

  events = ['createdConfig','removedConfig','initiatedRecovery'];

  async afterTransactionApply({transaction, stateStore, reducerHandler}) {
    if (transaction.moduleID === this.id && transaction.assetID === CREATE_RECOVERY_ASSET_ID) {
      let createRecoveryAsset = codec.decode(
        createRecoverySchema,
        transaction.asset
      );
      const friends = createRecoveryAsset.friends.map(bufferFriend => bufferFriend.toString('hex'));
      this._channel.publish('srs:createdConfig', {
         address: transaction._senderAddress.toString('hex'),
         friends: friends,
         recoveryThreshold: createRecoveryAsset.recoveryThreshold,
         delayPeriod: createRecoveryAsset.delayPeriod
      });
    } else if (transaction.moduleID === this.id && transaction.assetID === REMOVE_RECOVERY_ASSET_ID) {
      this._channel.publish('srs:removedConfig', {
        address: transaction._senderAddress.toString('hex')
      });
    } else if (transaction.moduleID === this.id && transaction.assetID === INITIATE_RECOVERY_ASSET_ID) {
      const initiateRecoveryAsset = codec.decode(
        initiateRecoverySchema,
        transaction.asset
      );
      this._channel.publish('srs:initiatedRecovery', {
        address: transaction._senderAddress.toString('hex'),
        config: initiateRecoveryAsset
      });
    }
  };

}

module.exports = { SRSModule };

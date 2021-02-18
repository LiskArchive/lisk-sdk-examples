const { BaseModule } = require('lisk-sdk');
const CreateRecovery = require('./assets/create_recovery');
const InitiateRecovery = require('./assets/initiate_recovery');
const VouchRecovery = require('./assets/vouch_recovery');
const ClaimRecovery = require('./assets/claim_recovery');
const CloseRecovery = require('./assets/close_recovery');
const RemoveRecovery = require('./assets/remove_recovery');
const SRSAccountSchema = require('./schema');

// Extend base module to implement your custom module
class SRSModule extends BaseModule {
  name = 'srs';
  id = 1000;
  accountSchema = SRSAccountSchema;

  transactionAssets = [
      new CreateRecovery(),
      new InitiateRecovery(),
      new VouchRecovery(),
      new ClaimRecovery(),
      new CloseRecovery(),
      new RemoveRecovery(),
    ];

  actions = {
    // Get all accounts with recovery configuration
    // getAllRecoverableAccounts: async () => getAllRecoverableAccounts(),
  };
}

module.exports = SRSModule;

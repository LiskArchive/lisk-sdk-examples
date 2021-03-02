const { initiateRecovery } = require('./initiate_recovery_api');
const { transferToken } = require('./transfer_token_api');
const { createRecoveryConfigTrs } = require('./create_recovery_api');
const { vouchRecovery } = require('./vouch_recovery_api');
const { claimRecovery } = require('./claim_recovery_api');
const { closeRecovery } = require('./close_recovery_api');
const { removeRecovery } = require('./remove_recovery_api');

module.exports = {
    initiateRecovery,
    transferToken,
    createRecoveryConfigTrs,
    vouchRecovery,
    claimRecovery,
    closeRecovery,
    removeRecovery,
};
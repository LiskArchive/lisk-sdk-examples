

const { systemDirs,  apiClient } = require('lisk-sdk');

const getIPCClient = async (label, rootPath) =>
    await apiClient.createIPCClient(systemDirs(label, rootPath).dataPath);

module.exports = {
    getIPCClient,
};

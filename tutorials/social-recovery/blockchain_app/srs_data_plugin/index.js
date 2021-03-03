const { BasePlugin, db } = require('lisk-sdk');
const pJSON = require('../package.json');
const fs_extra = require("fs-extra");
const os = require("os");
const path = require("path");

const DB_KEY_CONFIGACCOUNTS = "srs:configaccounts";

const getDBInstance = async (dataPath = '~/.lisk/srs-app/', dbName = 'srs_data_plugin.db') => {
  const dirPath = path.join(dataPath.replace('~', os.homedir()), 'plugins/data', dbName);
  await fs_extra.ensureDir(dirPath);
  return new db.KVStore(dirPath);
};

const encodedConfigAccountsSchema = {
  $id: 'srs/configAccounts',
  type: 'object',
  required: ['accounts'],
  properties: {
    accounts: {
      type: 'array',
      fieldNumber: 1,
      items: {
        type: 'object',
        properties: {
          address: {
            dataType: 'binary',
            fieldNumber: 1,
          },
          friends: {
            type: 'array',
            fieldNumber: 2,
            items: {
              type: 'binary',
              fieldNumber: 1,
            }
          },
          recoveryThreshold: {
            dataType: 'uint32',
            fieldNumber: 3
          },
          delayPeriod: {
            dataType: 'uint32',
            fieldNumber: 4
          }
        }
      },
    },
  },
};

const getConfigAccounts = async (database) => {
  try {
    const encodedConfigAccounts = await database.get(DB_KEY_CONFIGACCOUNTS);
    const { accounts } = codec.decode(encodedConfigAccountsSchema, encodedConfigAccounts);
    return accounts;
  }
  catch (error) {
    return [];
  }
};

// 1.plugin can be a daemon/HTTP/Websocket service for off-chain processing
class SRSDataPlugin extends BasePlugin {
  _accountsWithConfig = [];
  _db = undefined;

  static get alias() {
    return 'SRSData';
  }

  static get info() {
    return {
      author: pJSON.author,
      version: pJSON.version,
      name: pJSON.name,
    };
  }

  get defaults() {
    return {};
  }

  get events() {
    return [];
  }

  get actions() {
    return {
      getAllRecoveryConfigs: () => this._accountsWithConfig,
    };
  }

  async load(channel) {
    this._db = getDBInstance();
    this._accountsWithConfig =  await getConfigAccounts(this._db);
    channel.subscribe('srs:createdConfig', (info) => {
      console.log('info: ',info);
      //const { address, ...rest } = info;
      this._accountsWithConfig.push(info);
      console.log('this._accountsWithConfig: ', this._accountsWithConfig)
    });
  }

  async unload() {
  }
}

module.exports = { SRSDataPlugin };

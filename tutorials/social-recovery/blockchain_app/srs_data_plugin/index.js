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

const saveConfigAccounts = async (database) => {
  //const savedConfigs = await getConfigAccounts(database);
  //const encodedConfigs = codec.encode(encodedConfigAccountsSchema, savedConfigs);

  await database.put(DB_KEY_CONFIGACCOUNTS, { accounts: this._accountsWithConfig });
};

// 1.plugin can be a daemon/HTTP/Websocket service for off-chain processing
class SRSDataPlugin extends BasePlugin {
  _accountsWithConfig = undefined;
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
    this._db = await getDBInstance();
    this._accountsWithConfig =  await getConfigAccounts(this._db);
    channel.subscribe('srs:createdConfig', async (info) => {
      console.log('info: ',info);
      //const { address, ...rest } = info;
      let duplicate = false;
      for (let i = 0; i < this._accountsWithConfig.length; i++) {
        if (this._accountsWithConfig[i].address === info.address) {
          console.log('found!');
          duplicate = true;
          return;
        }
      }
      if (!duplicate){
        this._accountsWithConfig.push(info);
      }
      console.log('this._accountsWithConfig: ', this._accountsWithConfig);
      await saveConfigAccounts(this._db);
    });
  }

  async unload() {
  }
}

module.exports = { SRSDataPlugin };

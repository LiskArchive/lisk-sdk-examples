const { BasePlugin, db, codec } = require('lisk-sdk');
const pJSON = require('../package.json');
const fs_extra = require("fs-extra");
const os = require("os");
const path = require("path");

const DB_KEY_CONFIGACCOUNTS = "srs:configAccounts";

const getDBInstance = async (dataPath = '~/.lisk/srs-app/', dbName = 'srs_data_plugin.db') => {
  const dirPath = path.join(dataPath.replace('~', os.homedir()), 'plugins/data', dbName);
  await fs_extra.ensureDir(dirPath);
  return new db.KVStore(dirPath);
};

const encodedConfigAccountsSchema = {
  $id: 'srs:configAccounts',
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
            dataType: 'bytes',
            fieldNumber: 1,
          },
          friends: {
            type: 'array',
            fieldNumber: 2,
            items: {
              dataType: 'bytes',
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
    console.log("+++++ get config accounts ++++++");
    console.dir(accounts);
    return accounts;
  }
  catch (error) {
    console.log('pieps');
    return [];
  }
};

const saveConfigAccounts = async (database, accounts) => {
  //const savedConfigs = await getConfigAccounts(database);
  const bufferAccounts = accounts.map(account => {

    account.address = Buffer.from(account.address, 'hex');
    account.friends = account.friends.map(friend => Buffer.from(friend, 'hex'));
  });

  console.log('-------- bufferAccounts ---------');
  console.dir(bufferAccounts);
  //for (let i = 0; i < val.length; i++) {
  const encodedConfigs = codec.encode(encodedConfigAccountsSchema, { accounts });

  await database.put(DB_KEY_CONFIGACCOUNTS, encodedConfigs);
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
      getAllRecoveryConfigs: () => {
        console.log('~~~~~~~ this._accountsWithConfig ~~~~~~~~~~');
        console.dir(this._accountsWithConfig);
        let stringAccounts = this._accountsWithConfig.map((account) => {

          account.address = account.address.toString('hex');
          account.friends = account.friends.map(friend => friend.toString('hex'));
          console.log("acc");
          console.dir(account);
          return account;
        });
        console.log('~~~~~~~ stringAccounts ~~~~~~~~~~');
        console.dir(stringAccounts);
        return stringAccounts;
      },
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
        if (this._accountsWithConfig[i].address.toString('hex') === info.address) {
          console.log('found!');
          duplicate = true;
          return;
        }
      }
      if (!duplicate){
        info.address = Buffer.from(info.address, 'hex');
        info.friends = info.friends.map(friend => Buffer.from(friend, 'hex'));
        this._accountsWithConfig.push(info);
      }
      console.log('this._accountsWithConfig: ', this._accountsWithConfig);
      await saveConfigAccounts(this._db, this._accountsWithConfig);
    });
  }

  async unload() {
  }
}

module.exports = { SRSDataPlugin };

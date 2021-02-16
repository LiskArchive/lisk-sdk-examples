const { BasePlugin, apiClient } = require('lisk-sdk');
const { myConfig } = require('./defaults');
const pJSON = require('./package.json');

class MyPlugin extends BasePlugin {
  _latestDelegate = undefined;
  _knownTimestamps = [];

  static get alias() {
    return "myPlugin";
  }

  static get info() {
    return {
      author: pJSON.author,
      version: pJSON.version,
      name: pJSON.name,
    };
  }

  get defaults() {
    return myConfig;
  }

  get events() {
    return ['newDelegate','timestamp'];
  }

  get actions() {
    return {
      getKnownTimestamp: () => this._knownTimestamps,
      getLatestDelegate: () => this._latestDelegate
    };
  }

  async load(channel) {
    this._api = await apiClient.createWSClient('ws://localhost:8888/ws');

    channel.subscribe('app:transaction:new', (data) => {
      const txBuffer = Buffer.from(data.transaction, 'hex');
      const transaction = this._api.transaction.decode(txBuffer);
      if ( transaction.moduleID === 5 && transaction.assetID === 0 ) {
        this._latestDelegate = transaction.username;
        channel.publish('myPlugin:newDelegate', {
          name: transaction.username,
        });
      }
    });
    channel.subscribe('app:block:new', (data) => {
      const decodedBlock = this.codec.decodeBlock(data.block);
      this._knownTimestamps.push(decodedBlock.header.timestamp);
      channel.publish('myPlugin:timestamp', { timestamp: decodedBlock.header.timestamp });
    });
  }

  async unload() {
    this._latestDelegate = undefined;
    this._knownTimestamps = [];
  }
}

module.exports = { MyPlugin };

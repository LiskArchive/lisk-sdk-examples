const express = require('express');
const cors = require('cors');
const { BasePlugin } = require('lisk-sdk');
const pJSON = require('../../package.json');
const controllers = require('./controllers');

// 1.plugin can be a daemon/HTTP/Websocket service for off-chain processing
class SRSAPIPlugin extends BasePlugin {
  _server = undefined;
  _app = undefined;
  _channel = undefined;
  _db = undefined;
  _nodeInfo = undefined;

  static get alias() {
    return 'SRSHttpApi';
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
    return {};
  }

  async load(channel) {
    this._app = express();
    this._channel = channel;
    this._nodeInfo = await this._channel.invoke('app:getNodeInfo');

    this._app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'] }));
    this._app.use(express.json());

    this._app.post('/api/token/transfer', controllers.transferToken(this.codec, this._channel, this._nodeInfo));
    this._app.post('/api/recovery/create', controllers.createRecoveryConfigTrs(this.codec, this._channel, this._nodeInfo));
    this._app.post('/api/recovery/initiate', controllers.initiateRecovery(this.codec, this._channel, this._nodeInfo));
    this._app.post('/api/recovery/vouch', controllers.vouchRecovery(this.codec, this._channel, this._nodeInfo));
    this._app.post('/api/recovery/claim', controllers.claimRecovery(this.codec, this._channel, this._nodeInfo));
    this._app.post('/api/recovery/close', controllers.closeRecovery(this.codec, this._channel, this._nodeInfo));
    this._app.post('/api/recovery/remove', controllers.removeRecovery(this.codec, this._channel, this._nodeInfo));

    this._server = this._app.listen(8080, '0.0.0.0');
  }

  async unload() {
    // close http server
    await new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

module.exports = { SRSAPIPlugin };

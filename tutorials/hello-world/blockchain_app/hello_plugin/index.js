const { BasePlugin } = require("lisk-sdk");
const pJSON = require("../package.json");

class HelloAPIPlugin extends BasePlugin {
  _server = undefined;
  _app = undefined;
  _hello = undefined;

  static get alias() {
    return "HelloAPI";
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
      latestHello: () => this._hello,
    };
  }

  async load(channel) {
    channel.subscribe('hello:newHello', (info) => {
      this._hello = info;
    });
  }

  async unload() {
  }
}

module.exports = { HelloAPIPlugin };

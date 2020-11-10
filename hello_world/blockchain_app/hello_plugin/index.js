const express = require("express");
const cors = require("cors");
const { BasePlugin } = require("lisk-sdk");
const pJSON = require("../package.json");

class HelloAPIPlugin extends BasePlugin {
  _server = undefined;
  _app = undefined;

  static get alias() {
    return "HelloHTTPAPI";
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

    channel.once("app:ready", () => {
      this._app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT"] }));
      this._app.use(express.json());

      this._app.get("/api/hello_counter", async (_req, res) => {
        const counter = await channel.invoke("hello:amountOfHellos");

        await res.json({ data: counter });
      });
      this._server = this._app.listen(8080, "0.0.0.0");
    });
  }

  async unload() {
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

module.exports = { HelloAPIPlugin };

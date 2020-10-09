const { Server } = require("http");
const express = require("express");
const cors = require("cors");
const { BasePlugin } = require("lisk-sdk");
const pJSON = require("../package.json");

class NFTAPIPlugin extends BasePlugin {
  _server = undefined;
  _app = undefined;
  _channel = undefined;

  static get alias() {
    return "NFTHttpApi";
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

    this._channel.once("app:ready", () => {
      this._app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT"] }));
      this._app.use(express.json());

      this._app.get("/api/nft_tokens", async (_req, res) => {
        const nftTokens = await this._channel.invoke("nft:getAllNFTTokens");

        res.json({ data: nftTokens });
      });

      this._app.get("/api/nft_tokens/:id", async (req, res) => {
        const nftTokens = await this._channel.invoke("nft:getAllNFTTokens");
        console.log({ nftTokens, id: req.params.id });

        const token = nftTokens.find((t) => t.id === req.params.id);

        res.json({ data: token });
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

module.exports = { NFTAPIPlugin };

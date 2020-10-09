const { BaseModule } = require("lisk-sdk");
const { getAllNFTTokensAsJSON } = require("./nft_token");

const CreateNFT = require("./transactions/create_nft");
const TransferNFT = require("./transactions/transfer_nft");
const PurchaseNFT = require("./transactions/purchase_nft");

class NFTModule extends BaseModule {
  name = "nft";
  id = 1000;
  transactionAssets = [new CreateNFT(), new TransferNFT(), new PurchaseNFT()];

  accountSchema = {
    type: "object",
    required: ["ownNFTs"],
    properties: {
      ownNFTs: {
        type: "array",
        fieldNumber: 4,
        items: {
          dataType: "bytes",
        },
      },
    },
    default: {
      ownNFTs: [],
    },
  };

  actions = {
    getAllNFTTokens: async () => getAllNFTTokensAsJSON(this._dataAccess),
  };
}

module.exports = NFTModule;

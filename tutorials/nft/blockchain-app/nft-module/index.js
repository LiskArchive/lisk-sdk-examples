const { BaseModule } = require("lisk-sdk");
const { getAllNFTTokensAsJSON } = require("./nft");

const CreateNFT = require("./transactions/create_nft");
const PurchaseNFT = require("./transactions/purchase_nft");
const TransferNFTAsset = require("./transactions/transfer_nft");

// Extend base module to implement your custom module
class NFTModule extends BaseModule {
  name = "nft";
  id = 1024;
  accountSchema = {
    type: "object",
    required: ["ownNFTs"],
    properties: {
      ownNFTs: {
        type: "array",
        fieldNumber: 1,
        items: {
          dataType: "bytes",
        },
      },
    },
    default: {
      ownNFTs: [],
    },
  };
  transactionAssets = [new CreateNFT(), new PurchaseNFT(), new TransferNFTAsset()];
  actions = {
    // get all the registered NFT tokens from blockchain
    getAllNFTTokens: async () => getAllNFTTokensAsJSON(this._dataAccess),
  };
}

module.exports = { NFTModule };

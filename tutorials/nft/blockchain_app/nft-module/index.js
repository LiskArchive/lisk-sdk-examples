const { BaseModule } = require("lisk-sdk");
const { getAllNFTTokensAsJSON } = require("./nft_token");

const CreateNFT = require("./transactions/create_nft");
const PurchaseNFT = require("./transactions/purchase_nft");

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
  transactionAssets = [new CreateNFT(), new PurchaseNFT()];
  actions = {
    // get all the registered NFT tokens from blockchain
    getAllNFTTokens: async () => getAllNFTTokensAsJSON(this._dataAccess),
  };
}

module.exports = { NFTModule };

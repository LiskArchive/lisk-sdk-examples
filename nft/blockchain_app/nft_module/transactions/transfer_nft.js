const { BaseAsset } = require("lisk-sdk");
const { getAllNFTTokens, setAllNFTTokens } = require("../nft_token");

class TransferNFTAsset extends BaseAsset {
  name = "transferNFT";
  id = 2;
  schema = {
    $id: "lisk/nft/transfer",
    type: "object",
    required: ["nftId", "recipientAddress"],
    properties: {
      nftId: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      recipientAddress: {
        dataType: "bytes",
        fieldNumber: 2,
      },
    },
  };

  async apply({ asset, stateStore, transaction }) {
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);
    const recipientAccount = await stateStore.account.get(
      asset.recipientAddress
    );
    const nftTokens = await getAllNFTTokens(stateStore);
    const nftTokenIndex = nftTokens.findIndex((t) => t.id.equals(asset.nftId));

    if (nftTokenIndex < 0) {
      throw new Error("Token id not found");
    }

    const token = nftTokens[nftTokenIndex];

    if (token && !token.ownerAddress.equals(senderAddress)) {
      throw new Error("Only sender can transfer a NFT token");
    }

    const senderTokenIndex = senderAccount.nft.ownNFTs.findIndex((a) =>
      a.equals(asset.nftId)
    );
    senderAccount.nft.ownNFTs.splice(senderTokenIndex, 1);
    await stateStore.account.set(senderAddress, senderAccount);

    recipientAccount.nft.ownNFTs.push(asset.nftId);
    await stateStore.account.set(asset.recipientAddress, recipientAccount);

    token.ownerAddress = asset.recipientAddress;
    nftTokens[nftTokenIndex] = token;
    await setAllNFTTokens(stateStore, nftTokens);
  }
}

module.exports = TransferNFTAsset;

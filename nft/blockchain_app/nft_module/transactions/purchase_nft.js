const { BaseAsset } = require("lisk-sdk");
const { getAllNFTTokens, setAllNFTTokens } = require("../nft_token");

class PurchaseNFTAsset extends BaseAsset {
  name = "purchaseNFT";
  id = 3;
  schema = {
    $id: "lisk/nft/purchase",
    type: "object",
    required: ["nftId", "purchaseValue"],
    properties: {
      nftId: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      purchaseValue: {
        dataType: "uint64",
        fieldNumber: 2,
      },
    },
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const purchaserAddress = transaction.senderAddress;
    const purchaserAccount = await stateStore.account.get(purchaserAddress);

    const nftTokens = await getAllNFTTokens(stateStore);
    const nftTokenIndex = nftTokens.findIndex((t) => t.id.equals(asset.nftId));

    if (nftTokenIndex < 0) {
      throw new Error("Token id not found");
    }
    const token = nftTokens[nftTokenIndex];
    const tokenOwner = await stateStore.account.get(token.ownerAddress);
    const tokenOwnerAddress = tokenOwner.address;

    if (token && token.minPurchaseMargin === 0) {
      throw new Error("This NFT token can not be purchased");
    }

    const tokenCurrentValue = token.value;
    const tokenMinPurchaseValue =
      tokenCurrentValue +
      (tokenCurrentValue * BigInt(token.minPurchaseMargin)) / BigInt(100);
    const purchaseValue = asset.purchaseValue;

    if (tokenMinPurchaseValue > purchaseValue) {
      throw new Error("Token can not be purchased on given value");
    }

    const ownerTokenIndex = tokenOwner.nft.ownNFTs.findIndex((a) =>
      a.equals(token.id)
    );
    tokenOwner.nft.ownNFTs.splice(ownerTokenIndex, 1);
    await stateStore.account.set(tokenOwnerAddress, tokenOwner);

    purchaserAccount.nft.ownNFTs.push(token.id);
    await stateStore.account.set(purchaserAddress, purchaserAccount);

    token.ownerAddress = purchaserAddress;
    token.value = purchaseValue;
    nftTokens[nftTokenIndex] = token;
    await setAllNFTTokens(stateStore, nftTokens);

    await reducerHandler.invoke("token:debit", {
      address: purchaserAddress,
      amount: purchaseValue,
    });

    await reducerHandler.invoke("token:credit", {
      address: tokenOwnerAddress,
      amount: purchaseValue,
    });
  }
}

module.exports = PurchaseNFTAsset;

const { BaseAsset } = require("lisk-sdk");
const { getAllNFTTokens, setAllNFTTokens } = require("../nft");

// 1.extend base asset to implement your custom asset
class PurchaseNFTAsset extends BaseAsset {
  // 2.define unique asset name and id
  name = "purchaseNFT";
  id = 1;
  // 3.define asset schema for serialization
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
      name: {
        dataType: "string",
        fieldNumber: 3,
      },
    },
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const nftTokens = await getAllNFTTokens(stateStore);
    const nftTokenIndex = nftTokens.findIndex((t) => t.id.equals(asset.nftId));

    // 4.verify if purchasing nft exists
    if (nftTokenIndex < 0) {
      throw new Error("Token id not found");
    }
    const token = nftTokens[nftTokenIndex];
    const tokenOwner = await stateStore.account.get(token.ownerAddress);
    const tokenOwnerAddress = tokenOwner.address;

    // 5.verify if minimum nft purchasing condition met
    if (token && token.minPurchaseMargin === 0) {
      throw new Error("This NFT token can not be purchased");
    }

    const tokenCurrentValue = token.value;
    const tokenMinPurchaseValue =
      tokenCurrentValue +
      (tokenCurrentValue * BigInt(token.minPurchaseMargin)) / BigInt(100);
    const purchaseValue = asset.purchaseValue;

    if (tokenMinPurchaseValue > purchaseValue) {
      throw new Error("Token can not be purchased. Purchase value is too low. Minimum value: " + tokenMinPurchaseValue);
    }

    const purchaserAddress = transaction.senderAddress;
    const purchaserAccount = await stateStore.account.get(purchaserAddress);

    // 6.remove nft from owner account
    const ownerTokenIndex = tokenOwner.nft.ownNFTs.findIndex((a) =>
      a.equals(token.id)
    );
    tokenOwner.nft.ownNFTs.splice(ownerTokenIndex, 1);
    await stateStore.account.set(tokenOwnerAddress, tokenOwner);

    // 7.add nft to purchaser account
    purchaserAccount.nft.ownNFTs.push(token.id);
    await stateStore.account.set(purchaserAddress, purchaserAccount);

    token.ownerAddress = purchaserAddress;
    token.value = purchaseValue;
    nftTokens[nftTokenIndex] = token;
    await setAllNFTTokens(stateStore, nftTokens);

    // 8.debit LSK tokens from purchaser account
    await reducerHandler.invoke("token:debit", {
      address: purchaserAddress,
      amount: purchaseValue,
    });

    // 9.credit LSK tokens to purchaser account
    await reducerHandler.invoke("token:credit", {
      address: tokenOwnerAddress,
      amount: purchaseValue,
    });
  }
}

module.exports = PurchaseNFTAsset;

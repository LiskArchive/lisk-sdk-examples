const { BaseAsset } = require("lisk-sdk");
const {
  getAllNFTTokens,
  setAllNFTTokens,
  createNFTToken,
} = require("../nft_token");

class CreateNFTAsset extends BaseAsset {
  name = "createNFT";
  id = 1;
  schema = {
    $id: "lisk/nft/create",
    type: "object",
    required: ["minPurchaseMargin", "initValue"],
    properties: {
      minPurchaseMargin: {
        dataType: "uint32",
        fieldNumber: 1,
      },
      initValue: {
        dataType: "uint64",
        fieldNumber: 2,
      },
    },
  };

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const senderAddress = transaction.senderAddress;
    const senderAccount = await stateStore.account.get(senderAddress);
    const senderBalance = await reducerHandler.invoke("token:getBalance", {
      address: senderAddress,
    });
    const minRemainingBalance = await reducerHandler.invoke(
      "token:getMinRemainingBalance"
    );

    if (asset.initValue < minRemainingBalance) {
      throw new Error("NFT init value is too low.");
    }

    if (senderBalance < asset.initValue + minRemainingBalance) {
      throw new Error("Sender balance is not enough to create an NFT");
    }

    const nftToken = createNFTToken({
      ownerAddress: senderAddress,
      nonce: transaction.nonce,
      value: asset.initValue,
      minPurchaseMargin: asset.minPurchaseMargin,
    });

    senderAccount.nft.ownNFTs.push(nftToken.id);
    await stateStore.account.set(senderAddress, senderAccount);

    await reducerHandler.invoke("token:debit", {
      address: senderAddress,
      amount: asset.initValue,
    });

    const allTokens = await getAllNFTTokens(stateStore);
    allTokens.push(nftToken);
    await setAllNFTTokens(stateStore, allTokens);
  }
}

module.exports = CreateNFTAsset;

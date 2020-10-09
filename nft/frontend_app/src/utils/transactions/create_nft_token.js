/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const createNFTTokenSchema = {
  $id: "lisk/create-nft-asset",
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

export const createNFTToken = async ({
  initValue,
  minPurchaseMargin,
  passphrase,
  fee,
  networkIdentifier,
  minFeePerByte,
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase);
  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address.toString("hex"));

  const { id, ...rest } = transactions.signTransaction(
    createNFTTokenSchema,
    {
      moduleID: 1000,
      assetID: 1,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        initValue: BigInt(transactions.convertLSKToBeddows(initValue)),
        minPurchaseMargin: parseInt(minPurchaseMargin),
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createNFTTokenSchema), rest),
    minFee: calcMinTxFee(createNFTTokenSchema, minFeePerByte, rest),
  };
};

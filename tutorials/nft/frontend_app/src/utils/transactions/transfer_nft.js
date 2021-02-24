/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const transferNFTSchema = {
  $id: "lisk/nft/transfer",
  type: "object",
  required: ["nftId", "recipient"],
  properties: {
    nftId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    recipient: {
      dataType: "bytes",
      fieldNumber: 2,
    },
    name: {
      dataType: "string",
      fieldNumber: 3,
    },
  },
};

export const transferNFT = async ({
                                         name,
                                         nftId,
                                         recipientAddress,
                                         passphrase,
                                         fee,
                                         networkIdentifier,
                                         minFeePerByte,
                                       }) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase);
  const recipient = cryptography.getAddressFromBase32Address(recipientAddress);
  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address.toString("hex"));

  const { id, ...rest } = transactions.signTransaction(
    transferNFTSchema,
    {
      moduleID: 1024,
      assetID: 2,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        name,
        nftId: Buffer.from(nftId, "hex"),
        recipient: recipient,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(transferNFTSchema), rest),
    minFee: calcMinTxFee(transferNFTSchema, minFeePerByte, rest),
  };
};

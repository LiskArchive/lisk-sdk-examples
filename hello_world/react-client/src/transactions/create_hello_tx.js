/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema } from "./schema";
import { fetchAccountInfo } from "../../api";
import {baseAssetSchema} from "../../../../nft/frontend_app/src/utils/common";

export const createHelloTxSchema = {
    $id: "lisk/create-hello-asset",
    type: "object",
    required: ["hello"],
    properties: {
        hello: {
            dataType: 'string',
            fieldNumber: 1,
        },
    },
};

const calcMinTxFee = (assetSchema, minFeePerByte, tx) => {
    const assetBytes = codec.encode(assetSchema, tx.asset);
    const bytes = codec.encode(baseAssetSchema, { ...tx, asset: assetBytes });
    return BigInt(bytes.length * minFeePerByte);
};

export const createHelloTx = async ({
    helloString,
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
        createHelloTxSchema,
        {
            moduleID: 1000,
            assetID: 0,
            nonce: BigInt(nonce),
            fee: BigInt(transactions.convertLSKToBeddows(fee)),
            senderPublicKey: publicKey,
            asset: {
                hello: helloString,
            },
        },
        Buffer.from(networkIdentifier, "hex"),
        passphrase
    );

    return {
        id: id.toString("hex"),
        tx: codec.toJSON(getFullAssetSchema(createHelloTxSchema), rest),
        minFee: calcMinTxFee(createHelloTxSchema, minFeePerByte, rest),
    };
};

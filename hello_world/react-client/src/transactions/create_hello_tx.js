import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { fetchAccountInfo } from "../api";
import { baseAssetSchema, getFullAssetSchema } from "../utils";

export const createHelloTxSchema = {
    $id: "lisk/create-hello-asset",
    type: "object",
    required: ["helloString"],
    properties: {
        helloString: {
            dataType: 'string',
            fieldNumber: 1,
        },
    },
};

const calcMinTxFee = (assetSchema, minFeePerByte, tx) => {
    const assetBytes = codec.codec.encode(assetSchema, tx.asset);
    const bytes = codec.codec.encode(baseAssetSchema, { ...tx, asset: assetBytes });
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
                helloString: helloString,
            },
        },
        Buffer.from(networkIdentifier, "hex"),
        passphrase
    );

    return {
        id: id.toString("hex"),
        tx: codec.codec.toJSON(getFullAssetSchema(createHelloTxSchema), rest),
        minFee: calcMinTxFee(createHelloTxSchema, minFeePerByte, rest),
    };
};

const { codec, cryptography } = require("lisk-sdk");

const registeredNFTTokensSchema = {
  $id: "lisk/nft/registeredTokens",
  type: "object",
  required: ["registeredNFTTokens"],
  properties: {
    registeredNFTTokens: {
      type: "array",
      fieldNumber: 1,
      items: {
        type: "object",
        required: ["id", "value", "ownerAddress", "minPurchaseMargin", "name"],
        properties: {
          id: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          value: {
            dataType: "uint64",
            fieldNumber: 2,
          },
          ownerAddress: {
            dataType: "bytes",
            fieldNumber: 3,
          },
          minPurchaseMargin: {
            dataType: "uint32",
            fieldNumber: 4,
          },
          name: {
            dataType: "string",
            fieldNumber: 5,
          },
        },
      },
    },
  },
};

const CHAIN_STATE_NFT_TOKENS = "nft:registeredNFTTokens";

const createNFTToken = ({ name, ownerAddress, nonce, value, minPurchaseMargin }) => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([ownerAddress, nonceBuffer]);
  const id = cryptography.hash(seed);

  return {
    id,
    minPurchaseMargin,
    name,
    ownerAddress,
    value,
  };
};

const getAllNFTTokens = async (stateStore) => {
  const registeredTokensBuffer = await stateStore.chain.get(
    CHAIN_STATE_NFT_TOKENS
  );
  if (!registeredTokensBuffer) {
    return [];
  }

  const registeredTokens = codec.decode(
    registeredNFTTokensSchema,
    registeredTokensBuffer
  );

  return registeredTokens.registeredNFTTokens;
};

const getAllNFTTokensAsJSON = async (dataAccess) => {
  const registeredTokensBuffer = await dataAccess.getChainState(
    CHAIN_STATE_NFT_TOKENS
  );

  if (!registeredTokensBuffer) {
    return [];
  }

  const registeredTokens = codec.decode(
    registeredNFTTokensSchema,
    registeredTokensBuffer
  );

  return codec.toJSON(registeredNFTTokensSchema, registeredTokens)
    .registeredNFTTokens;
};

const setAllNFTTokens = async (stateStore, NFTTokens) => {
  const registeredTokens = {
    registeredNFTTokens: NFTTokens.sort((a, b) => a.id.compare(b.id)),
  };

  await stateStore.chain.set(
    CHAIN_STATE_NFT_TOKENS,
    codec.encode(registeredNFTTokensSchema, registeredTokens)
  );
};

module.exports = {
  registeredNFTTokensSchema,
  CHAIN_STATE_NFT_TOKENS,
  getAllNFTTokens,
  setAllNFTTokens,
  getAllNFTTokensAsJSON,
  createNFTToken,
};

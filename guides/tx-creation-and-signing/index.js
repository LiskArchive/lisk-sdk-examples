import { codec } from '@liskhq/lisk-codec';
import * as validator from '@liskhq/lisk-validator';
import { transactionSchema, transferAssetSchema } from 'schemas';

const unsignedTransaction = {
  moduleID: Number(2),
  assetID: Number(0),
  fee: BigInt(10000000),
  nonce: BigInt(23),
  senderPublicKey: Buffer.from('1dc86a88278ee6db12ff671318677ec23b9ee6231cfca71a2c99c2ab78338cb1'),
  asset: Buffer.alloc(0),
  signatures: [],
};

const transactionErrors = validator.validator.validate(transactionSchema, unsignedTransaction);

if (transactionErrors.length) {
  throw new validator.LiskValidationError([...transactionErrors]);
}

const rawTransferAsset = {
  amount: BigInt(2000000000),
  recipientAddress: Buffer.from('3e565c6f2d22e0a3c1e4717672ec8ac61c2660f2'),
  data: 'Happy birthday!'
};

const encodedTransferAsset = codec.fromJSON(transferAssetSchema, rawTransferAsset);

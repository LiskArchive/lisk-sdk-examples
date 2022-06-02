import { BaseAsset, ApplyAssetContext, ValidateAssetContext, codec } from 'lisk-sdk';
import { createPinPropsSchema, CreatePinProps, pinPropsSchema, PinProps } from '../schemas';

export class CreatePinAsset extends BaseAsset<CreatePinProps> {
	public name = 'createPin';
  public id = 0;

  // Define schema for asset
	public schema = createPinPropsSchema;



  public validate({ asset }: ValidateAssetContext<CreatePinProps>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<CreatePinProps>): Promise<void> {
		const { senderAddress } = transaction;

		const pin = {
			id: "",
			content: "",
			date: 0,
			author: senderAddress,
			replies: [],
			likes: []
		};
		pin.content = asset.message;
		await stateStore.chain.set(getIDForPin(pin), codec.encode(pinPropsSchema, pin));

	}
}

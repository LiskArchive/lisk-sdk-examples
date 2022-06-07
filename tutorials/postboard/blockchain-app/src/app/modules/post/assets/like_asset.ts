import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class LikeAsset extends BaseAsset {
	public name = 'like';
  public id = 3;

  // Define schema for asset
	public schema = {
    $id: 'post/like-asset',
		title: 'LikeAsset transaction asset for post module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "like" apply hook is not implemented.');
	}
}

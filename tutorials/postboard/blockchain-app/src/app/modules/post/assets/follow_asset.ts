import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class FollowAsset extends BaseAsset {
	public name = 'follow';
  public id = 4;

  // Define schema for asset
	public schema = {
    $id: 'post/follow-asset',
		title: 'FollowAsset transaction asset for post module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "follow" apply hook is not implemented.');
	}
}

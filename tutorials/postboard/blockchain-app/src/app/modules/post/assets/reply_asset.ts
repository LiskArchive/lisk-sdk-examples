import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class ReplyAsset extends BaseAsset {
	public name = 'reply';
  public id = 2;

  // Define schema for asset
	public schema = {
    $id: 'post/reply-asset',
		title: 'ReplyAsset transaction asset for post module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "reply" apply hook is not implemented.');
	}
}

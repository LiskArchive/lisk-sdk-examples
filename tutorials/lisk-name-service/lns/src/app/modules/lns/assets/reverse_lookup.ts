import { ApplyAssetContext, BaseAsset } from 'lisk-sdk';
import { LNSAccountProps, ReverseLookupAssetProps, reverseLookupAssetPropsSchema } from '../data';
import { getNodeForName } from '../storage';

export class ReverseLookupAsset extends BaseAsset<ReverseLookupAssetProps> {
	public name = 'reverse-lookup';
	public id = 2;

	// Define schema for asset
	public schema = reverseLookupAssetPropsSchema;

	// eslint-disable-next-line class-methods-use-this
	public async apply({
		asset,
		stateStore,
		transaction,
	}: ApplyAssetContext<ReverseLookupAssetProps>): Promise<void> {
		const node = getNodeForName(asset.name);
		const sender = await stateStore.account.get<LNSAccountProps>(transaction.senderAddress);

		const exists = sender.lns.ownNodes.find(n => n.equals(node));

		if (!exists) {
			throw new Error('You can only assign lookup node which you own.');
		}

		sender.lns.reverseLookup = node;
		await stateStore.account.set(sender.address, sender);
	}
}

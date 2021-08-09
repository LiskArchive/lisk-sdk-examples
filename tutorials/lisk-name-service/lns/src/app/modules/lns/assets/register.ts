import { addYears } from 'date-fns';
import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';
import { MIN_TTL_VALUE, VALID_TLDS } from '../constants';
import { LNSAccountProps, RegisterAssetProps, registerAssetPropsSchema } from '../data';
import { createLNSObject, getLNSObject, getNodeForName } from '../storage';

export class RegisterAsset extends BaseAsset<RegisterAssetProps> {
	public name = 'register';
	public id = 1;

	// Define schema for asset
	public schema = registerAssetPropsSchema;

	// eslint-disable-next-line class-methods-use-this
	public validate({ asset }: ValidateAssetContext<RegisterAssetProps>): void {
		if (asset.ttl < MIN_TTL_VALUE) {
			throw new Error(`Must set TTL value larger or equal to ${MIN_TTL_VALUE}`);
		}

		if (asset.registerFor < 1) {
			throw new Error('You can register name at least for 1 year.');
		}

		if (asset.registerFor > 5) {
			throw new Error('You can register name maximum for 5 year.');
		}

		const chunks = asset.name.split(/\./);

		if (chunks.length > 2) {
			throw new Error('You can only register second level domain name.');
		}

		if (!VALID_TLDS.includes(chunks[1])) {
			throw new Error(`Invalid TLD found "${chunks[1]}". Valid TLDs are "${VALID_TLDS.join()}"`);
		}
	}

	// eslint-disable-next-line class-methods-use-this
	public async apply({
		asset,
		stateStore,
		transaction,
	}: ApplyAssetContext<RegisterAssetProps>): Promise<void> {
		const node = getNodeForName(asset.name);
		const existingDomain = await getLNSObject(stateStore, node);

		if (existingDomain) {
			throw new Error(`The name "${asset.name}" already registered`);
		}

		const lnsObject = {
			name: asset.name,
			ttl: asset.ttl,
			expiry: Math.ceil(addYears(new Date(), asset.registerFor).getTime() / 1000),
			ownerAddress: transaction.senderAddress,
			records: [],
		};

		await createLNSObject(stateStore, lnsObject);

		const sender = await stateStore.account.get<LNSAccountProps>(transaction.senderAddress);
		sender.lns.ownNodes = [...sender.lns.ownNodes, node];
		await stateStore.account.set(sender.address, sender);
	}
}

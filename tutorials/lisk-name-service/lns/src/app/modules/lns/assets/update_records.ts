import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';
import {
	MAX_RECORDS,
	MAX_RECORD_LABEL_LENGTH,
	MAX_RECORD_VALUE_LENGTH,
	MIN_RECORD_LABEL_LENGTH,
	MIN_RECORD_VALUE_LENGTH,
	VALID_RECORD_TYPES,
} from '../constants';
import { LNSAccountProps, UpdateRecordsAssetProps, updateRecordsAssetPropsSchema } from '../data';
import { getLNSObject, updateLNSObject, getNodeForName } from '../storage';
import { isTTLPassed } from '../utils';

export class UpdateRecordsAsset extends BaseAsset<UpdateRecordsAssetProps> {
	public name = 'update-records';
	public id = 3;

	// Define schema for asset
	public schema = updateRecordsAssetPropsSchema;

	// eslint-disable-next-line class-methods-use-this
	public validate({ asset }: ValidateAssetContext<UpdateRecordsAssetProps>): void {
		if (asset.records.length > MAX_RECORDS) {
			throw new Error(`Can associate maximum ${MAX_RECORDS} records. Got ${asset.records.length}.`);
		}

		const recordKeys = new Set(asset.records.map(r => `${r.type.toString()}:${r.label}`));

		if (recordKeys.size !== asset.records.length) {
			throw new Error('Records should be unique among type and label');
		}

		for (const record of asset.records) {
			if (!VALID_RECORD_TYPES.includes(record.type)) {
				throw new Error(
					`Invalid record type "${
						record.type
					}". Valid record types are ${VALID_RECORD_TYPES.join()}`,
				);
			}

			if (
				record.label.length > MAX_RECORD_LABEL_LENGTH ||
				record.label.length < MIN_RECORD_LABEL_LENGTH
			) {
				throw new Error(
					`Record label can be between ${MIN_RECORD_LABEL_LENGTH}-${MAX_RECORD_LABEL_LENGTH}.`,
				);
			}

			if (
				record.value.length > MAX_RECORD_VALUE_LENGTH ||
				record.value.length < MIN_RECORD_VALUE_LENGTH
			) {
				throw new Error(
					`Record value can be between ${MIN_RECORD_VALUE_LENGTH}-${MAX_RECORD_VALUE_LENGTH}.`,
				);
			}
		}
	}

	// eslint-disable-next-line class-methods-use-this
	public async apply({
		asset,
		stateStore,
		transaction,
	}: ApplyAssetContext<UpdateRecordsAssetProps>): Promise<void> {
		const sender = await stateStore.account.get<LNSAccountProps>(transaction.senderAddress);
		const node = getNodeForName(asset.name);
		const lnsObject = await getLNSObject(stateStore, node);

		if (!lnsObject) {
			throw new Error(`LNS object with name "${asset.name}" is not registered`);
		}

		if (!lnsObject.ownerAddress.equals(sender.address)) {
			throw new Error('Only owner of hte LNS object can update records.');
		}

		if (!isTTLPassed(lnsObject)) {
			throw new Error('You have to wait for TTL from the last update.');
		}

		await updateLNSObject(stateStore, { node, records: asset.records });
	}
}

import {
	BaseCommand,
	CommandVerifyContext,
	VerificationResult,
	CommandExecuteContext,
} from 'lisk-sdk';
import { UpdateRecordsCommandParams } from '../types';
import { updateRecordsCommandParamsSchema } from '../schemas';
import {
	MAX_RECORDS,
	MAX_RECORD_LABEL_LENGTH,
	MAX_RECORD_VALUE_LENGTH,
	MIN_RECORD_LABEL_LENGTH,
	MIN_RECORD_VALUE_LENGTH,
	VALID_RECORD_TYPES,
} from '../constants';
// import { LNSAccountStore } from '../stores/lnsAccount';
import {
	getNodeForName,
	LNSNodeStore
} from '../stores/lnsNode';
import { isTTLPassed } from '../utils';

export class UpdateRecordsCommand extends BaseCommand {
  // Define schema for asset
	public schema = updateRecordsCommandParamsSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(context: CommandVerifyContext<UpdateRecordsCommandParams>): Promise<VerificationResult> {
		const { params } = context;
		if (params.records.length > MAX_RECORDS) {
			return {
				status: -1,
				error: new Error(`Can associate maximum ${MAX_RECORDS} records. Got ${params.records.length}.`),
			}
		}

		const recordKeys = new Set(params.records.map(r => `${r.type.toString()}:${r.label}`));
		if (recordKeys.size !== params.records.length) {
			return {
				status: -1,
				error: new Error('Records should be unique among type and label'),
			}
		}

		for (const record of params.records) {
			if (!VALID_RECORD_TYPES.includes(record.type)) {
				return {
					status: -1,
					error: new Error(
						`Invalid record type "${record.type}". Valid record types are ${VALID_RECORD_TYPES.join()}`,
					),
				}
			}

			if (
				record.label.length > MAX_RECORD_LABEL_LENGTH ||
				record.label.length < MIN_RECORD_LABEL_LENGTH
			) {
				return {
					status: -1,
					error: new Error(
						`Record label can be between ${MIN_RECORD_LABEL_LENGTH}-${MAX_RECORD_LABEL_LENGTH}.`,
					),
				}
			}

			if (
				record.value.length > MAX_RECORD_VALUE_LENGTH ||
				record.value.length < MIN_RECORD_VALUE_LENGTH
			) {
				return {
					status: -1,
					error: new Error(
						`Record value can be between ${MIN_RECORD_VALUE_LENGTH}-${MAX_RECORD_VALUE_LENGTH}.`,
					),
				}
			}
		}

		return {
			status: 1,
		}
	}

	public async execute(context: CommandExecuteContext<UpdateRecordsCommandParams>): Promise <void> {
		const { params, transaction } = context;
		// Get the sender account
		// const lnsAccountSubStore = this.stores.get(LNSAccountStore);
		// const sender = await lnsAccountSubStore.get(context, transaction.senderAddress);
	
		const node = getNodeForName(params.name);
		const lnsNodeSubStore = this.stores.get(LNSNodeStore);
		const lnsObject = await lnsNodeSubStore.get(context, node);

		if (!lnsObject) {
			throw new Error(`LNS object with name "${params.name}" is not registered`);
		}

		// @todo change transaction.senderAddress to sender.address
		if (!lnsObject.ownerAddress.equals(transaction.senderAddress)) {
			throw new Error('Only owner of hte LNS object can update records.');
		}

		if (!isTTLPassed(lnsObject)) {
			throw new Error('You have to wait for TTL from the last update.');
		}

		const updatedParams = {
			...lnsObject,
			records: params.records
		};

		await lnsNodeSubStore.createLNSObject(context, updatedParams);
	}
}

import { BaseStore } from 'lisk-sdk';
import { lnsStoreSchema } from '../schemas';
import { LNS } from '../types';

export class LNSStore extends BaseStore<LNS> {
	public schema = lnsStoreSchema;
}

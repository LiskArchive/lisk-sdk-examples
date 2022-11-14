import { BaseStore } from 'lisk-framework';
import { lnsStoreSchema } from '../schemas';
import { LNS } from '../types';

export class LNSStore extends BaseStore<LNS> {
	public schema = lnsStoreSchema;
}

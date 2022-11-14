import { BaseStore } from 'lisk-framework';
import { LNSAccount } from "../types";
import { lsnAccountStoreSchema } from "../schemas";

export class LNSAccountStore extends BaseStore<LNSAccount> {
	public schema = lsnAccountStoreSchema;
}

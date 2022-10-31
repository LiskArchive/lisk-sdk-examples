import { BaseStore } from 'lisk-sdk';
import { LNSAccount } from "../types";
import { lsnAccountStoreSchema } from "../schemas";

export class LNSAccountStore extends BaseStore<LNSAccount> {
	public schema = lsnAccountStoreSchema;
}

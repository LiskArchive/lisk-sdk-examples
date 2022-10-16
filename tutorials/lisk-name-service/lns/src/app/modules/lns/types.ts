import { Schema } from 'lisk-sdk';

export interface LNS {
	type: number;
	label: string;
	value: string;
}

export interface LNSAccount {
	lns: {
    reverseLookup: Buffer;
		ownNodes: Buffer[];
	};
}

export interface CommandProps {
  readonly name: string;
  readonly schema: Schema;
}

export interface RegisterCommandParams {
	name: string;
	ttl: number;
	registerFor: number;
}

export interface ReverseLookupCommandParams {
	name: string;
}

export interface UpdateRecordsCommandParams {
  name: string;
  records: LNS[];
}

export interface LNSNode {
	ownerAddress: Buffer;
	name: string;
	ttl: number;
	expiry: number;
	records: LNS[];
	createdAt: number;
	updatedAt: number;
}

export interface LNSNodeJSON {
	ownerAddress: string;
	name: string;
	ttl: number;
	expiry: number;
	records: LNS[];
	createdAt: number;
	updatedAt: number;
}

export const enum RegisterLNSEventResult {
	SUCCESSFUL = 0,
	FAIL = 1
}

export interface RegisterLNSErrorEventResult {
	status: number;
	error: string;
}

export interface RegisterLNSEventData {
	senderAddress: Buffer;
	name: string;
	ttl: number;
	registerFor: number;
	result: RegisterLNSEventResult;
}

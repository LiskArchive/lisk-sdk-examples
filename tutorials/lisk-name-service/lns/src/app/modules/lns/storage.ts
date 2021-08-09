// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../@types/eth-ens-namehash/index.d.ts" />
import * as namehash from 'eth-ens-namehash';
import { chain, codec, StateStore } from 'lisk-sdk';
import { EMPTY_BUFFER, LNS_PREFIX } from './constants';
import { LNSAccountProps, LNSNode, lnsNodeSchema } from './data';
import { isExpired } from './utils';

export const getKeyForNode = (node: Buffer): string => `${LNS_PREFIX}:${node.toString('hex')}`;
export const getNodeForName = (name: string): Buffer =>
	Buffer.from(namehash.hash(name).slice(2), 'hex');

export const resolveNode = async ({
	chainGetter,
	node,
}: {
	chainGetter: (address: string) => Promise<Buffer | undefined>;
	node: Buffer;
}): Promise<LNSNode> => {
	const result = await chainGetter(getKeyForNode(node));

	if (!result) {
		throw new Error(`Node "${node.toString('hex')}" could not resolve.`);
	}

	const lnsNode = codec.decode<LNSNode>(lnsNodeSchema, result);

	if (isExpired(lnsNode)) {
		throw new Error(`Node "${node.toString('hex')}" is associated to an expired LNS object.`);
	}

	return lnsNode;
};

export const resolveName = async ({
	chainGetter,
	name,
}: {
	chainGetter: (address: string) => Promise<Buffer | undefined>;
	name: string;
}): Promise<LNSNode> => {
	const result = await chainGetter(getKeyForNode(getNodeForName(name)));

	if (!result) {
		throw new Error(`Name "${name}" could not resolve.`);
	}

	const lnsNode = codec.decode<LNSNode>(lnsNodeSchema, result);

	if (isExpired(lnsNode)) {
		throw new Error(`Name "${name}" is associated to an expired LNS object.`);
	}

	return lnsNode;
};

export const lookupAddress = async ({
	accountGetter,
	chainGetter,
	address,
}: {
	accountGetter: (address: Buffer) => Promise<chain.Account<LNSAccountProps>>;
	chainGetter: (address: string) => Promise<Buffer | undefined>;
	address: Buffer;
}): Promise<LNSNode> => {
	let account: chain.Account<LNSAccountProps>;

	try {
		account = await accountGetter(address);
	} catch {
		throw new Error(`Lookup account "${address.toString('hex')}" not found.`);
	}

	if (account.lns.reverseLookup === EMPTY_BUFFER) {
		throw new Error(`Account "${address.toString('hex')}" is not associated with any LNS object.`);
	}

	const result = await chainGetter(getKeyForNode(account.lns.reverseLookup));

	if (!result) {
		throw new Error(`Problem looking up node "${account.lns.reverseLookup.toString('hex')}"`);
	}

	const lnsNode = codec.decode<LNSNode>(lnsNodeSchema, result);

	if (isExpired(lnsNode)) {
		throw new Error(`Account "${address.toString('hex')}" is associated to an expired LNS object.`);
	}

	return lnsNode;
};

export const getLNSObject = async (
	stateStore: StateStore,
	node: Buffer,
): Promise<LNSNode | undefined> => {
	const result = await stateStore.chain.get(getKeyForNode(node));

	if (!result) {
		return;
	}

	// eslint-disable-next-line consistent-return
	return codec.decode<LNSNode>(lnsNodeSchema, result);
};

export const createLNSObject = async (
	stateStore: StateStore,
	params: Omit<LNSNode, 'createdAt' | 'updatedAt' | 'node'> & { name: string },
): Promise<void> => {
	const { name, ...lnsObject } = params;
	const node = getNodeForName(name);

	const input: LNSNode = {
		...lnsObject,
		name,
		createdAt: Math.ceil(Date.now() / 1000),
		updatedAt: Math.ceil(Date.now() / 1000),
	};

	await stateStore.chain.set(getKeyForNode(node), codec.encode(lnsNodeSchema, input));
};

export const updateLNSObject = async (
	stateStore: StateStore,
	params: Partial<Omit<LNSNode, 'createdAt' | 'updatedAt'>> & { node: Buffer },
): Promise<void> => {
	const lnsObject = await getLNSObject(stateStore, params.node);

	if (!lnsObject) {
		throw new Error('No lns object is associated with this name');
	}

	lnsObject.ttl = params.ttl ?? lnsObject.ttl;
	lnsObject.ownerAddress = params.ownerAddress ?? lnsObject.ownerAddress;
	lnsObject.expiry = params.expiry ?? lnsObject.expiry;
	lnsObject.records = params.records ?? lnsObject.records;

	lnsObject.updatedAt = Math.ceil(Date.now() / 1000);

	await stateStore.chain.set(getKeyForNode(params.node), codec.encode(lnsNodeSchema, lnsObject));
};

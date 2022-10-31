import { BaseStore, ImmutableStoreGetter, StoreGetter } from 'lisk-sdk';
// import { codec } from '@liskhq/lisk-codec';
import * as namehash from 'eth-ens-namehash';
import { LNS_PREFIX } from "../constants";
import { lnsNodeStoreSchema } from '../schemas';
import { LNSNode } from '../types';

// Create a hash from the domain name and return it as Buffer
export const getKeyForNode = (node: Buffer): string => `${LNS_PREFIX}:${node.toString('hex')}`;

export const getNodeForName = (name: string): Buffer => Buffer.from(namehash.hash(name).slice(2), 'hex');

export class LNSNodeStore extends BaseStore<LNSNode> {
	public schema = lnsNodeStoreSchema;

	public async getObject(context: ImmutableStoreGetter, node: Buffer) {
		const result = await this.get(context, node);
		return result;
		// return codec.decode<LNSNode>(lnsNodeStoreSchema, result);
	}

	public async createLNSObject(
		context: StoreGetter,
		params: Omit<LNSNode, 'createdAt' | 'updatedAt' | 'node'> & { name: string },
	) {
		const node = getNodeForName(params.name);
		const lnsNode = {
			...params,
			node,
			createdAt: Math.ceil(Date.now() / 1000),
			updatedAt: Math.ceil(Date.now() / 1000),
		};
		await this.set(context, node, lnsNode);
	}

	public async updateLNSObject(
		context: StoreGetter,
		params: Partial<Omit<LNSNode, 'createdAt' | 'updatedAt'>> & { node: Buffer },
	) {
		const lnsNode = await this.get(context, params.node);

		if (!lnsNode) {
			throw new Error('No lns object is associated with this name');
		}

		lnsNode.ttl = params.ttl ?? lnsNode.ttl;
		lnsNode.ownerAddress = params.ownerAddress ?? lnsNode.ownerAddress;
		lnsNode.expiry = params.expiry ?? lnsNode.expiry;
		lnsNode.records = params.records ?? lnsNode.records;
		lnsNode.updatedAt = Math.ceil(Date.now() / 1000);

		await this.set(context, params.node, lnsNode);
	}
}

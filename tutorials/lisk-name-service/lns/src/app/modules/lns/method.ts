import { BaseMethod, codec } from 'lisk-sdk';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import { MethodContext } from 'lisk-framework';
import {
  LNSNodeStore,
  getKeyForNode,
  getNodeForName
} from './stores/lnsNode';
import { LNSAccountStore } from './stores/lnsAccount';
import { EMPTY_BUFFER } from './constants';
import { isExpired } from './utils';
import {
  LNSNode,
  LNSNodeJSON,
	LNSAccount,
} from './types';
import { lnsNodeStoreSchema } from './schemas';

export class LnsMethod extends BaseMethod {
  public async lookupAddress(
		ctx: MethodContext,
		address: string,
	): Promise<LNSNode> {
    const accountSubStore = this.stores.get(LNSAccountStore);
    const lnsNodeSubStore = this.stores.get(LNSNodeStore);

		if (typeof address !== 'string') {
			throw new Error('Parameter address must be a string.');
		}
    cryptoAddress.validateLisk32Address(address);
		const accountData: LNSAccount = await accountSubStore.get(
			ctx,
			cryptoAddress.getAddressFromLisk32Address(address),
		);

    if (accountData.lns.reverseLookup === EMPTY_BUFFER) {
      throw new Error(`Account "${address.toString()}" is not associated with any LNS object.`);
    }

    const lnsNodeData = await lnsNodeSubStore.get(
			ctx,
			accountData.lns.reverseLookup, // @todo should I get by key or node value?
		);

    if (!lnsNodeData) {
      throw new Error(`Problem looking up node "${accountData.lns.reverseLookup.toString()}"`);
    }

    // @todo remove this
    const lnsNode = codec.decode<LNSNodeJSON>(lnsNodeStoreSchema, Buffer.from(lnsNodeData));
    if (isExpired(lnsNode)) {
      throw new Error(`Account "${address.toString()}" is associated to an expired LNS object.`);
    }

    return lnsNodeData;
	}

  public async resolveName(
		ctx: MethodContext,
		name: string,
	): Promise<LNSNode> {
    const lnsNodeSubStore = this.stores.get(LNSNodeStore);

		if (typeof name !== 'string') {
			throw new Error('Parameter name must be a string.');
		}

    const nodeData: LNSNode = await lnsNodeSubStore.get(
			ctx,
			getNodeForName(name),
		)

    // @todo remove this
    const lnsNode = codec.decode<LNSNodeJSON>(lnsNodeStoreSchema, Buffer.from(nodeData));

    if (isExpired(lnsNode)) {
      throw new Error(`Name "${name}" is associated to an expired LNS object.`);
    }

    return nodeData;
	}

  public async resolveNode(
		ctx: MethodContext,
		node: Buffer,
	): Promise<LNSNode> {
    const lnsNodeSubStore = this.stores.get(LNSNodeStore);

    if (!Buffer.isBuffer(node)) {
			throw new Error('Parameter name must be a Buffer.');
		}

    const nodeData: LNSNode = await lnsNodeSubStore.get(
			ctx,
			Buffer.from(getKeyForNode(node)),
		);

    if (!nodeData) {
      throw new Error(`Node "${node.toString('hex')}" could not resolve.`);
    }

    // @todo remove this
    const lnsNode = codec.decode<LNSNodeJSON>(lnsNodeStoreSchema, Buffer.from(nodeData));

    if (isExpired(lnsNode)) {
      throw new Error(`Node "${node.toString('hex')}" is associated to an expired LNS object.`);
    }
  
    return nodeData;
	}
}

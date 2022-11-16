import { BaseEndpoint, codec } from 'lisk-sdk';
import { address as cryptoAddress } from '@liskhq/lisk-cryptography';
import { ModuleEndpointContext } from 'lisk-framework';
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

export class LnsEndpoint extends BaseEndpoint {
  public async lookupAddress(ctx: ModuleEndpointContext): Promise<LNSNodeJSON> {
    const accountSubStore = this.stores.get(LNSAccountStore);
    const lnsNodeSubStore = this.stores.get(LNSNodeStore);

    const { address } = ctx.params;
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


    const lnsNode: LNSNodeJSON = codec.toJSON(lnsNodeStoreSchema, lnsNodeData);
    // const lnsNode = codec.decode<LNSNodeJSON>(lnsNodeStoreSchema, Buffer.from(lnsNodeData));
    if (isExpired(lnsNode)) {
      throw new Error(`Account "${address.toString()}" is associated to an expired LNS object.`);
    }

    return lnsNode;
  }

  public async resolveName(ctx: ModuleEndpointContext): Promise<LNSNodeJSON> {
    const lnsNodeSubStore = this.stores.get(LNSNodeStore);

    const { name } = ctx.params;

    if (typeof name !== 'string') {
			throw new Error('Parameter name must be a string1.');
		}

    const node = getNodeForName(name);

    const nodeData: LNSNode = await lnsNodeSubStore.get(
			ctx,
			node,
		)

    const lnsNode: LNSNodeJSON = codec.toJSON(lnsNodeStoreSchema, nodeData);
    if (isExpired(lnsNode)) {
      throw new Error(`Name "${name}" is associated to an expired LNS object.`);
    }
    
    return lnsNode;
  }

  public async resolveNode(ctx: ModuleEndpointContext): Promise<LNSNodeJSON> {
    const lnsNodeSubStore = this.stores.get(LNSNodeStore);

    const { node } = ctx.params;
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

    const lnsNode: LNSNodeJSON = codec.toJSON(lnsNodeStoreSchema, nodeData);

    if (isExpired(lnsNode)) {
      throw new Error(`Node "${node.toString('hex')}" is associated to an expired LNS object.`);
    }
  
    return lnsNode;
  }
}

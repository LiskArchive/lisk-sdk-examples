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
    ctx.logger.info('=> 1Address: ', address);
    const results = await accountSubStore.has(ctx, cryptoAddress.getAddressFromLisk32Address(address));
    ctx.logger.info('=> Iterated <= ', JSON.stringify(results));
		const accountData: LNSAccount = await accountSubStore.get(
			ctx,
			cryptoAddress.getAddressFromLisk32Address(address),
		);
    ctx.logger.info('=> 2Address: ');

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

    const lnsNode = codec.decode<LNSNodeJSON>(lnsNodeStoreSchema, Buffer.from(lnsNodeData));
    if (isExpired(lnsNode)) {
      throw new Error(`Account "${address.toString()}" is associated to an expired LNS object.`);
    }

    return lnsNode;
  }

  public async resolveName(ctx: ModuleEndpointContext): Promise<LNSNodeJSON> {
    const lnsNodeSubStore = this.stores.get(LNSNodeStore);
    // const accountSubStore = this.stores.get(LNSAccountStore);
    ctx.logger.info('ENDPOINT: resolveName');

    const { name } = ctx.params;
    ctx.logger.info('=> Name: ', name as string);

    if (typeof name !== 'string') {
			throw new Error('Parameter name must be a string1.');
		}

    // const results = await accountSubStore.iterate(ctx, {});

    ctx.logger.info('=> Iterated <= ');

    const node = getNodeForName(name);
    ctx.logger.info('=> Node: ', node.toString('hex'));

    const domainExists = await lnsNodeSubStore.has(ctx, node);
    ctx.logger.info('=> domainExists: ', JSON.stringify(domainExists));

    const nodeData: LNSNode = await lnsNodeSubStore.get(
			ctx,
			node,
		)

    ctx.logger.info('-> name: ', nodeData.ownerAddress.toString('hex'));

    const lnsNode = codec.decode<LNSNodeJSON>(lnsNodeStoreSchema, Buffer.from(nodeData));

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

    const lnsNode = codec.decode<LNSNodeJSON>(lnsNodeStoreSchema, Buffer.from(nodeData));

    if (isExpired(lnsNode)) {
      throw new Error(`Node "${node.toString('hex')}" is associated to an expired LNS object.`);
    }
  
    return lnsNode;
  }
}

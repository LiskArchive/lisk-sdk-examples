/* eslint-disable class-methods-use-this */

import {
	BaseCCCommand,
	CrossChainMessageContext,
	codec,
} from 'lisk-sdk';
import { crossChainReactParamsSchema, CCReactMessageParams } from '../schemas'
import { MAX_RESERVED_ERROR_STATUS } from '../../react/constants'

interface Params {
}

export class ReactCommand extends BaseCCCommand {
	public schema = crossChainReactParamsSchema;

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(ctx: CrossChainMessageContext): Promise<void> {
		const { ccm } = ctx;

		if (ccm.status > MAX_RESERVED_ERROR_STATUS) {
			throw new Error('Invalid CCM status code.');
		}
	}

	public async execute(ctx: CrossChainMessageContext): Promise<void> {
		const { ccm } = ctx;
		const methodContext = ctx.getMethodContext();
		const { sendingChainID, status, receivingChainID } = ccm;
		const params = codec.decode<CCReactMessageParams>(
			crossChainReactParamsSchema,
			ccm.params,
		);
		const { postID, reactionType, senderAddress } = params;
	}
}

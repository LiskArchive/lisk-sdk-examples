/*
 * Copyright © 2022 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */
import { BaseEvent, EventQueuer } from 'lisk-sdk';
import { newHelloEventSchema } from '../schema';
import { NewHelloEventData } from '../types';

export class NewHelloEvent extends BaseEvent<NewHelloEventData> {
	public schema = newHelloEventSchema;

	public log(ctx: EventQueuer, data: NewHelloEventData): void {
		this.add(ctx, data, [data.senderAddress]);
	}
}

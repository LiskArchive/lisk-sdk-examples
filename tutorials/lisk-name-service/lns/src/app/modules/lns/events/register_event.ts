import { BaseEvent, EventQueuer } from 'lisk-sdk';
import { registerLnsEventSchema } from '../schemas';
import {
  RegisterLNSEventResult,
  RegisterLNSEventData,
  // RegisterLNSErrorEventResult,
 } from '../types';

export class RegisterLNSEvent extends BaseEvent<RegisterLNSEventData & { result: RegisterLNSEventResult }> {
	public schema = registerLnsEventSchema;

	public log(ctx: EventQueuer, data: RegisterLNSEventData): void {
		this.add(ctx, { ...data, result: RegisterLNSEventResult.SUCCESSFUL }, [
			data.senderAddress,
			Buffer.from(data.name),
		]);
	}

	// public error(ctx: EventQueuer, data: RegisterLNSEventData, result: RegisterLNSErrorEventResult): void {
	// 	this.add(ctx, { ...data, result }, [data.senderAddress, Buffer.from(data.name)], true);
	// }
}

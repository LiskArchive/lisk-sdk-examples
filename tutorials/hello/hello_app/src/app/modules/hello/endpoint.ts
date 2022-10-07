import { BaseEndpoint, ModuleEndpointContext, cryptography } from 'lisk-sdk';
import { CounterStore, CounterStoreData } from './stores/counter';
import { MessageStore, MessageStoreData } from './stores/message';

export class HelloEndpoint extends BaseEndpoint {

	public async getHelloCounter(ctx: ModuleEndpointContext): Promise<CounterStoreData> {
		const counterSubStore = this.stores.get(CounterStore);

		const helloCounter = await counterSubStore.get(
			ctx,
			Buffer.from('hello','utf8'),
		);

		return helloCounter;
	}

	public async getHello(ctx: ModuleEndpointContext): Promise<MessageStoreData> {
		const messageSubStore = this.stores.get(MessageStore);

		const { address } = ctx.params;
		if (typeof address !== 'string') {
			throw new Error('Parameter address must be a string.');
		}
		cryptography.address.validateLisk32Address(address);
		const helloMessage = await messageSubStore.get(
			ctx,
			cryptography.address.getAddressFromLisk32Address(address),
		);
		return helloMessage;
	}
}

import { BaseEndpoint, ModuleEndpointContext, cryptography } from 'lisk-sdk';
import { CounterStore, CounterStoreData } from './stores/counter';
import { MessageStore, MessageStoreData } from './stores/message';

export class HelloEndpoint extends BaseEndpoint {

	public async getHelloCounter(ctx: ModuleEndpointContext): Promise<CounterStoreData> {
		const counterSubStore = this.stores.get(CounterStore);

		const helloCounterData = await counterSubStore.get(
			ctx,
			Buffer.from('hello','utf8'),
		);

		return helloCounterData;
	}

	public async getHello(ctx: ModuleEndpointContext): Promise<MessageStoreData> {
		const counterSubStore = this.stores.get(MessageStore);

		const { address } = ctx.params;
		if (typeof address !== 'string') {
			throw new Error('Parameter address must be a string.');
		}
		cryptography.address.validateLisk32Address(address);
		const helloCounterData = await counterSubStore.get(
			ctx,
			cryptography.address.getAddressFromLisk32Address(address),
		);
		return helloCounterData;
	}
}

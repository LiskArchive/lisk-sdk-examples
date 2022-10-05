import { BaseEndpoint, ModuleEndpointContext, codec } from 'lisk-sdk';
import { CounterStore, CounterStoreData } from './stores/counter';

export class HelloEndpoint extends BaseEndpoint {

	public async getHelloCounter(ctx: ModuleEndpointContext): Promise<CounterStoreData> {
		const counterSubStore = this.stores.get(CounterStore);

		const helloCounterData = await counterSubStore.get(
			ctx,
			Buffer.from('hello','utf8'),
		);

		return helloCounterData;
	}
}

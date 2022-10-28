import { BasePlugin, apiClient } from 'lisk-sdk';

 /* eslint-disable class-methods-use-this */
 /* eslint-disable  @typescript-eslint/no-empty-function */
 export class LatestHelloPlugin extends BasePlugin {
	// private _channel!: BaseChannel;

	// public name: string = 'latestHello';

	public get nodeModulePath(): string {
		return __filename;
	}

	public get events(): string[] {
		return [
			// 'block:created',
			// 'block:missed'
		];
	}

	public async load(): Promise<void> {
		const client = await apiClient.createIPCClient('~/.lisk/hello-client');
		client.subscribe("hello_newHello", ( _data ) => {

		});
		// this._channel = channel;
		// this._channel.once('app:ready', () => {});
	}

	public async unload(): Promise<void> {}
}

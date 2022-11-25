/* eslint-disable @typescript-eslint/no-floating-promises */
import { BasePlugin, db as liskDB, codec } from 'lisk-sdk';
import {
	getDBInstance,
	getLastCounter,
	getLastEventHeight,
	setEventHelloInfo,
	setLastCounter,
	setLastEventHeight
} from './db';
import { configSchema, chainEventSchema } from './schemas';
import { HelloInfoPluginConfig, Height, Counter } from './types';
import { Endpoint } from './endpoint';

export class HelloInfoPlugin extends BasePlugin<HelloInfoPluginConfig> {
	public configSchema = configSchema;
	public endpoint = new Endpoint();
	public counter = 0;
	private _pluginDB!: liskDB.Database;

	public get nodeModulePath(): string {
		return __filename;
	}

	// loads DB instances and initiates counter for first run.
	public async load(): Promise<void> {
		this._pluginDB = await getDBInstance(this.dataPath);
		this.endpoint.init(this._pluginDB);

		// Syncs plugin's database after an interval.
		setInterval(() => { this._syncChainEvents(); }, this.config.syncInterval);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async unload(): Promise<void> {
		this._pluginDB.close();
	}

	// Syncs on-chain event's data with plugin's database.
	private async _syncChainEvents(): Promise<void> {
		const res = await this.apiClient.invoke<{ header: { height: number } }>("chain_getLastBlock", {
		})
		const heightObj = await this._getLastHeight();
		const lastStoredHeight = heightObj.height + 1;
		const { height } = res.header;
		// Loop through new blocks, starting from the lastStoredHeight + 1
		for (let index = lastStoredHeight; index <= height; index += 1) {
			const result = await this.apiClient.invoke<{ data: string; height: number; module: string; name: string }[]>("chain_getEvents", {
				height: index
			});
			const helloEvents = result.filter(e => e.module === 'hello' && e.name === 'newHello');
			for (const helloEvent of helloEvents) {
				const parsedData = codec.decode<{ senderAddress: Buffer; message: string }>(chainEventSchema, Buffer.from(helloEvent.data, 'hex'));
				const { counter } = await this._getLastCounter();
				await this._saveEventInfoToDB(parsedData, helloEvent.height, counter + 1);
			}
		}
		await setLastEventHeight(this._pluginDB, height);
	}

	private async _getLastCounter(): Promise<Counter> {
		try {
			const counter = await getLastCounter(this._pluginDB);
			return counter;
		} catch (error) {
			if (!(error instanceof liskDB.NotFoundError)) {
				throw error;
			}
			await setLastCounter(this._pluginDB, 0);
			return { counter: 0 };
		}
	}

	private async _getLastHeight(): Promise<Height> {
		try {
			const height = await getLastEventHeight(this._pluginDB);
			return height;
		} catch (error) {
			if (!(error instanceof liskDB.NotFoundError)) {
				throw error;
			}
			await setLastEventHeight(this._pluginDB, 0);
			return { height: 0 };
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async _saveEventInfoToDB(parsedData: { senderAddress: Buffer; message: string }, chainHeight: number, counterValue: number): Promise<string> {
		// Saves newly generated hello events to the database.
		const { senderAddress, message } = parsedData;
		await setEventHelloInfo(this._pluginDB, senderAddress, message, chainHeight, counterValue);
		await setLastCounter(this._pluginDB, counterValue);
		await setLastEventHeight(this._pluginDB, chainHeight);
		return "Data Saved";
	}
}


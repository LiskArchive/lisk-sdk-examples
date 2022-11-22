/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { BasePlugin, db as liskDB, PluginInitContext, codec } from 'lisk-sdk';
import {
	getDBInstance,
	getLastCounter,
	getLastEventHeight,
	setEventHelloInfo,
	setLastCounter,
	setLastEventHeight
} from './db';
import { configSchema, chainEventSchema } from './schemas';
import { HelloInfoPluginConfig } from './types';
import { Endpoint } from './endpoint';

export class HelloInfoPlugin extends BasePlugin<HelloInfoPluginConfig> {
	public configSchema = configSchema;
	public endpoint = new Endpoint();
	public counter = 0;
	private height = 0;
	private _pluginDB!: liskDB.Database;

	public get nodeModulePath(): string {
		return __filename;
	}

	public async init(context: PluginInitContext): Promise<void> {
		await super.init(context);
	}

	// loads DB instances and initiates counter for first run.
	public async load(): Promise<void> {
		this._pluginDB = await getDBInstance(this.dataPath);
		this.endpoint.init(this._pluginDB);
		const lastCounter = await getLastCounter(this._pluginDB);
		if (lastCounter.counter > 0) {
			// Syncs plugin's database after an interval.
			setInterval(() => { this._syncChainEvents(); }, this.config.syncInterval);
		} else {
			const newCounter = 0;
			await setLastCounter(this._pluginDB, newCounter);
			// Syncs plugin's database after an interval.
			setInterval(() => { this._syncChainEvents(); }, this.config.syncInterval);
		}
	}


	// eslint-disable-next-line @typescript-eslint/require-await
	public async unload(): Promise<void> { 	// Unloads DB instance.
		console.log("Program shutdown succesfull.")
		this._pluginDB.close();
	}

	// Syncs on-chain event's data with plugin's database.
	private _syncChainEvents(): void {
		this.apiClient.invoke("chain_getLastBlock", {
		}).then(res => {
			this.height = res['header']['height'];
			for (let index = 1; index < this.height; index += 1) {
				this.apiClient.invoke("chain_getEvents", {
					height: index
				}).then(result => {
					if (result[3] !== undefined) {
						const dataElement = result[3]['data'];
						const height = result[3]['height'];
						const parsedData = codec.decode(chainEventSchema, Buffer.from(dataElement, 'hex'));
						this._saveEventInfoToDB(parsedData, height);
					}
				});
			}
		});
	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async _saveEventInfoToDB(parsedData: any, height: number) {    // Saves newly generated hello events to the database.

		const lastEventHeight = await getLastEventHeight(this._pluginDB);

		if (typeof lastEventHeight.height !== typeof height) {
			await setLastEventHeight(this._pluginDB, height);
			const senderAddress = parsedData['senderAddress'];
			const message = parsedData['message'].toString();
			const lastCounter = await getLastCounter(this._pluginDB);
			await setEventHelloInfo(this._pluginDB, senderAddress, message, height, lastCounter.counter += 1);
			await setLastCounter(this._pluginDB, lastCounter.counter);
		} else if (height > lastEventHeight.height) {
			const senderAddress = parsedData['senderAddress'];
			const message = parsedData['message'].toString();
			const lastCounter = await getLastCounter(this._pluginDB);
			await setEventHelloInfo(this._pluginDB, senderAddress, message, height, lastCounter.counter += 1);
			await setLastCounter(this._pluginDB, lastCounter.counter);
			await setLastEventHeight(this._pluginDB, height);
		} else if (lastEventHeight.height === height) {
			console.log("");
			console.log("****************************");
			console.log("Please Generate a new Event.");
			console.log("****************************");
			console.log("");
		}
	}
}


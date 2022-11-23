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
import { HelloInfoPluginConfig, Height, Counter } from './types';
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
		this._getLastCounter(this.counter);
		this._getLastHeight(this.height);
		// Syncs plugin's database after an interval.
		setInterval(() => { this._syncChainEvents(); }, this.config.syncInterval);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async unload(): Promise<void> { 	// Unloads DB instance.
		console.log("Program shutdown succesfull.")
		this._pluginDB.close();
	}

	// Syncs on-chain event's data with plugin's database.
	private _syncChainEvents(): void {
		this.apiClient.invoke("chain_getLastBlock", {
		}).then(async (res) => {
			const heightObj = this._getLastHeight(this.height);
			const lastStoredHeight = (await heightObj).height + 1;
			this.height = res['header']['height'];
			for (let index = lastStoredHeight; index <= this.height; index += 1) {
				this.apiClient.invoke("chain_getEvents", {
					height: index
				}).then(result => {
					if (result[3] !== undefined) {
						const dataElement = result[3]['data'];
						const chainHeight = result[3]['height'];
						const parsedData = codec.decode(chainEventSchema, Buffer.from(dataElement, 'hex'));
						this._saveEventInfoToDB(parsedData, chainHeight, lastStoredHeight);
					}
				});
			}
		});
	}

	private async _getLastCounter(_counter: number): Promise<Counter> {
		let lastCounter = await getLastCounter(this._pluginDB);
		if (typeof lastCounter.counter !== typeof _counter) {
			await setLastCounter(this._pluginDB, _counter);
			lastCounter = await getLastCounter(this._pluginDB);
		}
		return lastCounter;
	}

	private async _getLastHeight(_height: number): Promise<Height> {
		let lastEventHeight = await getLastEventHeight(this._pluginDB);
		if (typeof lastEventHeight.height !== typeof _height) {
			await setLastEventHeight(this._pluginDB, _height);
			lastEventHeight = await getLastEventHeight(this._pluginDB);
		}
		return lastEventHeight;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async _saveEventInfoToDB(parsedData: any, _chainHeight: number, _lastStoredHeight: number) {    // Saves newly generated hello events to the database.
		if (_lastStoredHeight === _chainHeight) {
			console.log("");
			console.log("*************************************************");
			console.log("No New Hello event since the last syncronization.");
			console.log("*************************************************");
			console.log("");
		}
		else if (_chainHeight > _lastStoredHeight) {
			const senderAddress = parsedData['senderAddress'];
			const message = parsedData['message'].toString();
			const lastCounter = await getLastCounter(this._pluginDB);
			await setEventHelloInfo(this._pluginDB, senderAddress, message, _chainHeight, lastCounter.counter += 1);
			await setLastCounter(this._pluginDB, lastCounter.counter);
			await setLastEventHeight(this._pluginDB, _chainHeight);
		}
	}
}


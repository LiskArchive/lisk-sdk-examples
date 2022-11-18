/* eslint-disable no-console */

import { BasePlugin, db as liskDB, PluginInitContext } from 'lisk-sdk';
import {
	getDBInstance,
	setLastCounter,
	getLastCounter,
} from './db';
import { configSchema } from './schemas';
import { HelloInfoPluginConfig } from './types';
import { Endpoint } from './endpoint';

export class HelloInfoPlugin extends BasePlugin<HelloInfoPluginConfig> {
	public configSchema = configSchema;
	public endpoint = new Endpoint();
	public counter = 0;
	public height = 0;
	private _addressPluginDB!: liskDB.Database;

	public get nodeModulePath(): string {
		return __filename;
	}

	public async init(context: PluginInitContext): Promise<void> {
		await super.init(context);
	}

	// loads DB instances and initiates counter for first run.
	public async load(): Promise<void> {
		if (this.config.enablePlugin) {
			this._addressPluginDB = await getDBInstance(this.dataPath);
			this.endpoint.init(this._addressPluginDB, this.apiClient);
			const lastCounter = await getLastCounter(this._addressPluginDB);
			if (lastCounter.counter > 0) {
				console.log("Value of Last Counter is: ", lastCounter.counter);
			} else {
				const newCounter = 0;
				await setLastCounter(this._addressPluginDB, newCounter);
			}
		} else {
			console.log("");
			console.log("************************************************************************");
			console.log("HelloInfo Plugin is disabled, please enable it in the config.json file.");
			console.log("************************************************************************");
			console.log("");
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async unload(): Promise<void> { 	// Unloads DB instance.
		console.log("Program shutdown succesfull.")
		this._addressPluginDB.close();
	}
}


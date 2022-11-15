/* eslint-disable prefer-destructuring */
/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable for-direction */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
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
				let newCounter = 0;
				await setLastCounter(this._addressPluginDB, newCounter);
			}
		} else {
			console.log("");
			console.log("*******************************************************************");
			console.log("HelloInfo Plugin is disabled, please enable it in the config.json file.");
			console.log("*******************************************************************");
			console.log("");
		}
	}
	// Unloads DB instance.
	public async unload(): Promise<void> {
		console.log("Program shutdown succesfull.")
		this._addressPluginDB.close();
	}
}


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
import { BasePlugin, db as liskDB, PluginInitContext, cryptography, codec } from 'lisk-sdk';
import {
	getDBInstance,
	setEventHelloInfo,
	setLastCounter,
	getLastCounter,
	setLastEventHeight,
	getLastEventHeight,
	getEventHelloInfo
} from './db';
import { chainEventSchema, configSchema } from './schemas';
import { HelloInfoPluginConfig, Event } from './types';
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

	public async load(): Promise<void> {
		if (this.config.enablePlugin) {
			this._addressPluginDB = await getDBInstance(this.dataPath);
			this.endpoint.init(this._addressPluginDB, this.apiClient);
			const lastCounter = await getLastCounter(this._addressPluginDB);
			if (lastCounter.counter > 0) {
				//this._fetchHelloEvents();
			} else {
				let newCounter = 0;
				await setLastCounter(this._addressPluginDB, newCounter);
				//this._fetchHelloEvents();

			}
		} else {
			console.log("");
			console.log("*******************************************************************");
			console.log("Hello Plugin is disabled, please enable it in the config.json file.");
			console.log("*******************************************************************");
			console.log("");
		}
	}

	public async unload(): Promise<void> {
		console.log("Program shutdown succesfull.")
		this._addressPluginDB.close();
	}

	// private _fetchHelloEvents(): void {
	// 	this.apiClient.invoke("chain_getLastBlock", {
	// 	}).then(res => {
	// 		this.height = res['header']['height'];
	// 		for (let index = 1; index < this.height; index += 1) {
	// 			this.apiClient.invoke("chain_getEvents", {
	// 				height: index
	// 			}).then(result => {
	// 				if (result[3] !== undefined) {
	// 					let dataElement = result[3]['data'];
	// 					const height = result[3]['height'];
	// 					const parsedData = codec.decode(chainEventSchema, Buffer.from(dataElement, 'hex'));
	// 					this._saveEventInfoToDB(parsedData, height);
	// 				}
	// 			});
	// 		}
	// 	});
	// }

	// private async _saveEventInfoToDB(parsedData: Record<string, unknown>, height: number) {

	// 	const lastEventHeight = await getLastEventHeight(this._addressPluginDB);
	// 	if (height > lastEventHeight.height) {

	// 		let senderAddress = parsedData['senderAddress'];
	// 		let message = parsedData['message'];
	// 		const lastCounter = await getLastCounter(this._addressPluginDB);
	// 		await setEventHelloInfo(this._addressPluginDB, senderAddress, message.toString(), height, lastCounter.counter += 1);
	// 		await setLastCounter(this._addressPluginDB, lastCounter.counter);

	// 	} else if (lastEventHeight.height === height) {

	// 		console.log("***************************");
	// 		console.log("Please Generate a new Event");
	// 		console.log("***************************");

	// 	} else {

	// 		await setLastEventHeight(this._addressPluginDB, height);
	// 		let senderAddress = parsedData['senderAddress'];
	// 		let message = parsedData['message'];
	// 		let lastCounter = await getLastCounter(this._addressPluginDB);
	// 		await setEventHelloInfo(this._addressPluginDB, senderAddress, message.toString(), height, lastCounter.counter += 1);
	// 		await setLastCounter(this._addressPluginDB, lastCounter.counter);

	// 	}
	// }
}


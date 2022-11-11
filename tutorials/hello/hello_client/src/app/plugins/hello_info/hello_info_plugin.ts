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
	setLastEventHeight
} from './db';
import { newHelloEventSchema, configSchema } from './schemas';
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

	public async load(): Promise<void> {
		if (this.config.enablePlugin) {
			this._addressPluginDB = await getDBInstance(this.dataPath);
			this.endpoint.init(this._addressPluginDB, this.apiClient);
			const lastCounter = await getLastCounter(this._addressPluginDB);
			if (lastCounter.counter > 0) {
				this._fetchHelloEvents();
			} else {
				let newCounter = 0;
				await setLastCounter(this._addressPluginDB, newCounter);
				this._fetchHelloEvents();
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

	private _fetchHelloEvents(): void {
		// this.apiClient.subscribe(
		// 	'network_newBlock',
		// 	async (event) => {
		// 		if (!event) {
		// 			this.logger.error('Invalid payload for network_newBlock');
		// 			return;
		// 		}
		// 		let parsedData = event;
		// 		console.log(parsedData);
		// 		this._saveAddressesToDB(parsedData);
		// 	},
		// )



		this.apiClient.invoke("chain_getLastBlock", {
		}).then(res => {
			this.height = res['header']['height'];
			//console.log('Height is', this.height);
			for (let index = 1; index < this.height; index += 1) {
				//console.log("Before chain_getEvents call", index);
				this.apiClient.invoke("chain_getEvents", {
					height: index
				}).then(result => {
					//console.log(result[0]['module'])
					if (result[3] !== undefined) {
						//console.log(result[3]);
						let dataElement = result[3]['data'];
						const height = result[4]['height'];

						const parsedData = codec.decode(newHelloEventSchema, Buffer.from(dataElement, 'hex'));

						//console.log(cryptography.address.getLisk32AddressFromAddress(parsedData['senderAddress']));
						//console.log(parsedData['message']);
						this._saveAddressesToDB(parsedData, height);
					}
				});
			}
		});
	}

	private async _saveAddressesToDB(parsedData: Record<string, unknown>, height: number): Promise<string> {
		console.log(parsedData);
		console.log(height)
		await setLastEventHeight(this._addressPluginDB, height);
		// let senderAddress = parsedData['senderAddress'];
		// let message = parsedData['message'];
		// const lastCounter = await getLastCounter(this._addressPluginDB);
		// await setEventHelloInfo(this._addressPluginDB, senderAddress, message, lastCounter.counter += 1);
		// await setLastCounter(this._addressPluginDB, lastCounter.counter);
		return "Data Saved";
	}
}



					//console.log(result[index]);
					// for (let height = 0; height < this.height; index += 1) {
					// 	console.log("Value of index is: ", height);
					// }
					//if (result[index] === index) {
					//console.log("Value of INDEX is: ", index);
					//console.log("Result: ", result[index]);
					//}


					// for (let height = 0; height < array.length; height += 1) {

					// 	console.log("Value of index is: ", index);
					// 	//if (result[index] === index) {
					// 	console.log("Value of INDEX is: ", index);
					// 	console.log("Result: ", result[index]);
					// 	//}
					// }





					//if (result[index]['module'] === 'hello') {
					//	console.log("Result: ", result[index]);
					// let dataElement = result[3]['data'];

					// const decoded = codec.decode(newHelloEventSchema, Buffer.from(dataElement, 'hex'));

					// console.log(cryptography.address.getLisk32AddressFromAddress(decoded['senderAddress']));
					// console.log(decoded['message']);
					//	}


							// for (let index = 0; index < array.length; index++) {
		// 	const element = array[index];

		// }

		// this.apiClient.invoke("chain_getEvents", {
		// 	height: 263
		// }).then(res => {
		// 	console.log("Result: ", res[3].data);
		// 	let dataElement = res[3]['data'];

		// 	const decoded = codec.decode(newHelloEventSchema, Buffer.from(dataElement, 'hex'));

		// 	console.log(cryptography.address.getLisk32AddressFromAddress(decoded['senderAddress']));
		// 	console.log(decoded['message']);
		// 	//return decoded;
		// 	// const newHello = codec.codec.decode(newHelloEventSchema, res[2].data);
		// 	// console.log("newHello: ", newHello);
		// });
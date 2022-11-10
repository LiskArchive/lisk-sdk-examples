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
	setAddressInfo,
	setLastCounter,
	getLastCounter
} from './db';
import { configSchema } from './schemas';
import { HelloInfoPluginConfig } from './types';
import { Endpoint } from './endpoint';


const bytesArraySchema = {
	$id: '/liskChain/bytesarray',
	type: 'object',
	required: ['list'],
	properties: {
		list: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'bytes',
			},
		},
	},
};


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
				this._subscribeToEvent();
			} else {
				let newCounter = 0;
				await setLastCounter(this._addressPluginDB, newCounter);
				this._subscribeToEvent();
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

	private _subscribeToEvent(): void {
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

		// for (let index = 0; index < array.length; index++) {
		// 	const element = array[index];

		// }

		this.apiClient.invoke("chain_getEvents", {
			height: 137
		}).then(res => {
			console.log("Result: ", res);
			// const newHello = codec.codec.decode(newHelloEventSchema, res[2].data);
			// console.log("newHello: ", newHello);
		});

		// this.apiClient.invoke("chain_getLastBlock", {
		// }).then(res => {
		// 	this.height = res['header']['height'];

		// 	for (let index = 1; index <= this.height; index += 1) {
		// 		this.apiClient.invoke("chain_getEvents", {
		// 			height: index
		// 		}).then(result => {
		// 			if (result['module'] === 'hello') {
		// 				console.log("Result: ", result);
		// 			}

		// 		});
		// 	}
		// });




	}

	private async _saveAddressesToDB(parsedData: Record<string, unknown>): Promise<string> {
		let addrslsk = parsedData['blockHeader']['generatorAddress'];
		let fullAddress = cryptography.address.getAddressFromLisk32Address(addrslsk)
		const lastCounter = await getLastCounter(this._addressPluginDB);
		await setAddressInfo(this._addressPluginDB, addrslsk, fullAddress, lastCounter.counter += 1);
		await setLastCounter(this._addressPluginDB, lastCounter.counter);
		return "Data Saved";
	}
}

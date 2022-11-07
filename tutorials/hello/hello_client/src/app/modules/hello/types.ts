import {
	JSONObject
} from 'lisk-sdk';

export interface NewHelloEventData {
	senderAddress: Buffer;
	message: string;
}

export interface ModuleConfig {
	maxMessageLength: number;
	minMessageLength: number;
	blacklist: string[];
}

export type ModuleConfigJSON = JSONObject<ModuleConfig>;
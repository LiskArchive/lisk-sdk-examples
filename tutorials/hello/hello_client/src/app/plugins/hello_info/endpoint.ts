/* eslint-disable dot-notation */
import { BasePluginEndpoint, PluginEndpointContext, db as liskDB, cryptography } from 'lisk-sdk';
import { getEventHelloInfo } from './db';

export class Endpoint extends BasePluginEndpoint {
	private _pluginDB!: liskDB.Database;

	// Initialize the database instance here
	public init(db: liskDB.Database) {
		this._pluginDB = db;
	}

	// Returns all Sender Addresses, Hello Messages, and Block Height of the block where the Hello Event was emitted.
	public async getMessageList(_context: PluginEndpointContext): Promise<unknown[]> {
		const data: {
			ID: number;
			senderAddress: string;
			message: string;
			blockHeight;
		}[] = [];
		// 1. Get all the stored events from the database.
		const messageList = await getEventHelloInfo(this._pluginDB);
		// 2. Push them into an array for presentation.
		for (const helloMessage of messageList) {
			data.push({
				ID: helloMessage.id.readUInt32BE(0),
				senderAddress: cryptography.address.getLisk32AddressFromAddress(
					helloMessage['senderAddress'],
				),
				message: helloMessage['message'],
				blockHeight: helloMessage['height'],
			});
		}
		return data;
	}
}

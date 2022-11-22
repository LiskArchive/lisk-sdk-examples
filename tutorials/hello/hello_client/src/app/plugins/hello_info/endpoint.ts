/* eslint-disable dot-notation */
import {
    BasePluginEndpoint,
    PluginEndpointContext,
    db as liskDB,
    cryptography,

} from 'lisk-sdk';
import {
    getEventHelloInfo,
    getLastCounter,

} from './db';

import { Event as helloEvent } from './types';


export class Endpoint extends BasePluginEndpoint {
    // private _client!: BasePlugin['apiClient'];
    private _pluginDB!: liskDB.Database;


    // public init(db: liskDB.Database, apiClient: BasePlugin['apiClient']) {
    public init(db: liskDB.Database) {
        this._pluginDB = db;
        // this._client = apiClient;
    }

    // Returns all Sender Addresses, Hello Messages and Block Height of the block where the Hello Event was emitted.
    public async getMessageList(_context: PluginEndpointContext): Promise<unknown[]> {
        let addressList: helloEvent;
        const data: {
            ID: number;
            senderAddress: string;
            message: string;
            blockHeight;
        }[] = [];
        const lastCounter = await getLastCounter(this._pluginDB);
        for (let index = 1; index <= lastCounter.counter; index += 1) {
            addressList = await getEventHelloInfo(this._pluginDB, index);
            data.push({
                ID: index,
                senderAddress: cryptography.address.getLisk32AddressFromAddress(addressList['senderAddress']),
                message: addressList['message'],
                blockHeight: addressList['height'],
            })
        }
        return data;
    }
}
/* eslint-disable dot-notation */
import {
    BasePluginEndpoint,
    PluginEndpointContext,
    db as liskDB,
    cryptography,

} from 'lisk-sdk';
import {
    getEventHelloInfo,

} from './db';


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
        const data: {
            ID: number;
            senderAddress: string;
            message: string;
            blockHeight;
        }[] = [];
        const results = await getEventHelloInfo(this._pluginDB, 0);
        for (const addressList of results) {
            data.push({
                ID: addressList.id.readUInt32BE(0),
                senderAddress: cryptography.address.getLisk32AddressFromAddress(addressList['senderAddress']),
                message: addressList['message'],
                blockHeight: addressList['height'],
            })
        }
        return data;
    }
}
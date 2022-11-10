/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
/* eslint-disable spaced-comment */
import {
    BasePluginEndpoint,
    PluginEndpointContext,
    BasePlugin,
    db as liskDB,
} from 'lisk-sdk';
import {
    getAddressInfo,
    getLastCounter
} from './db';


export class Endpoint extends BasePluginEndpoint {
    // public testPlugin = new TestPlugin();
    private _client!: BasePlugin['apiClient'];
    private _db!: liskDB.Database;

    public init(db: liskDB.Database, apiClient: BasePlugin['apiClient']) {
        this._db = db;
        this._client = apiClient;
    }

    public async getAddressList(_context: PluginEndpointContext): Promise<any[]> {
        let addressList: any;
        const data = [];
        const lastCounter = await getLastCounter(this._db);
        for (let index = 1; index < lastCounter.counter; index += 1) {
            addressList = await getAddressInfo(this._db, index);
            data.push({
                ID: index,
                Addresses: addressList
            })
        }
        return data;
    }
}


//console.log(addressList);

//console.log("Hello Endpoint");
//console.log("Value of Counter is: ", lastCounter.counter);
//console.log("ID of address is: ", index);

        //const addressList = this.testPlugin._getAddressFromDB(this._db);
        //await getAddressInfo(this._db);
            // const encodedAddressInfo = await this._db.get(DB_KEY_ADDRESS_INFO);
    // console.log(encodedAddressInfo);
    // return codec.decode<Address>(addressStoreSchema, encodedAddressInfo);
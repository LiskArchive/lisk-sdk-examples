/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
/* eslint-disable spaced-comment */
import {
    BasePluginEndpoint,
    PluginEndpointContext,
    BasePlugin,
    db as liskDB,
    cryptography,
    codec,
} from 'lisk-sdk';
import {
    getEventHelloInfo,
    getLastCounter,
    getLastEventHeight,
    setEventHelloInfo,
    setLastCounter,
    setLastEventHeight
} from './db';
import { chainEventSchema } from './schemas';


export class Endpoint extends BasePluginEndpoint {
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
        for (let index = 1; index <= lastCounter.counter; index += 1) {
            addressList = await getEventHelloInfo(this._db, index);
            data.push({
                ID: index,
                Sender_Address: cryptography.address.getLisk32AddressFromAddress(addressList.senderAddress),
                Message: addressList.message,
                Block_Height: addressList.height,
            })
        }
        return data;
    }

    public async syncChainEvents() {
        try {
            await this._fetchHelloEvents();
            return "Events Synced. Please fetch events again."
        } catch (error) {
            return error;
        }

    }

    private _fetchHelloEvents(): void {
        this._client.invoke("chain_getLastBlock", {
        }).then(res => {
            this.height = res['header']['height'];
            for (let index = 1; index < this.height; index += 1) {
                this._client.invoke("chain_getEvents", {
                    height: index
                }).then(result => {
                    if (result[3] !== undefined) {
                        let dataElement = result[3]['data'];
                        const height = result[3]['height'];
                        const parsedData = codec.decode(chainEventSchema, Buffer.from(dataElement, 'hex'));
                        this._saveEventInfoToDB(parsedData, height);
                    }
                });
            }
        });
    }

    private async _saveEventInfoToDB(parsedData: Record<string, unknown>, height: number) {

        const lastEventHeight = await getLastEventHeight(this._db);

        if (typeof lastEventHeight.height !== typeof height) {
            await setLastEventHeight(this._db, height);
            let senderAddress = parsedData['senderAddress'];
            let message = parsedData['message'];
            let lastCounter = await getLastCounter(this._db);
            await setEventHelloInfo(this._db, senderAddress, message.toString(), height, lastCounter.counter += 1);
            await setLastCounter(this._db, lastCounter.counter);
        } else if (height > lastEventHeight.height) {
            let senderAddress = parsedData['senderAddress'];
            let message = parsedData['message'];
            const lastCounter = await getLastCounter(this._db);
            await setEventHelloInfo(this._db, senderAddress, message.toString(), height, lastCounter.counter += 1);
            await setLastCounter(this._db, lastCounter.counter);
            await setLastEventHeight(this._db, height);

        } else if (lastEventHeight.height === height) {
            console.log("");
            console.log("***************************");
            console.log("Please Generate a new Event");
            console.log("***************************");
            console.log("");
        }
    }
}
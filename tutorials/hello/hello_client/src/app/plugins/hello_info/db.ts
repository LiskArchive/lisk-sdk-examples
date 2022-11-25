/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */


import { codec, db as liskDB, cryptography } from 'lisk-sdk';
import * as os from 'os';
import { join } from 'path';
import { ensureDir } from 'fs-extra';
import { newHelloEventSchema, counterSchema, heightSchema } from './schemas';
import { Event, Counter, Height } from './types';
import { DB_KEY_ADDRESS_INFO, DB_LAST_COUNTER_INFO, DB_LAST_HEIGHT_INFO } from './constants';

const { Database } = liskDB;
type KVStore = liskDB.Database;

// Returns DB's instance.
export const getDBInstance = async (
    dataPath: string,
    dbName = 'lisk-framework-helloInfo-plugin.db',
): Promise<KVStore> => {
    const dirPath = join(dataPath.replace('~', os.homedir()), 'plugins/data', dbName);
    await ensureDir(dirPath);
    return new Database(dirPath);
};

// Returns event's data stored in the database.
export const getEventHelloInfo = async (db: KVStore, _lastCounter: number): Promise<(Event & { id: Buffer })[]> => {
    const stream =  db.createReadStream({
        gte: Buffer.concat([DB_KEY_ADDRESS_INFO, Buffer.alloc(4, 0)]),
        lte: Buffer.concat([DB_KEY_ADDRESS_INFO, Buffer.alloc(4, 255)]),
    });
    const results = await new Promise<(Event& { id: Buffer })[]>((resolve, reject) => {
        const ids: (Event& { id: Buffer })[] = [];
        stream
            .on('data', ({ key, value }: { key: Buffer; value: Buffer }) => {
                ids.push({ ...codec.decode<Event>(newHelloEventSchema, value), id: key.slice(DB_KEY_ADDRESS_INFO.length) });
            })
            .on('error', error => {
                reject(error);
            })
            .on('end', () => {
                resolve(ids);
            });
    });
    return results;
};

// Stores event's data in the database.
export const setEventHelloInfo = async (db: KVStore, _lskAddress: Buffer, _message: string, _eventHeight: number, lastCounter: number): Promise<void> => {
    const encodedAddressInfo = codec.encode(newHelloEventSchema, { senderAddress: _lskAddress, message: _message, height: _eventHeight });
    console.log("DB FUNCTION setEVENTHELLOINFO");
    console.log(_lskAddress);
    console.log(_message);
    console.log(_eventHeight);
    let dbKey = cryptography.utils.intToBuffer(lastCounter, 4);
    dbKey = Buffer.concat([DB_KEY_ADDRESS_INFO, dbKey]);
    await db.set(dbKey, encodedAddressInfo);
    console.log("");
    console.log("************************************** Event's Data saved successfully in the database **************************************");
};

// Stores lastCounter for key generation.
export const setLastCounter = async (db: KVStore, lastCounter: number) => {
    try {
        console.log("COUNTER IN DB: ", lastCounter);
        const encodedCounterInfo = codec.encode(counterSchema, { counter: lastCounter });
        await db.set(DB_LAST_COUNTER_INFO, encodedCounterInfo);
        console.log("");
        console.log("************************************** Counter saved successfully in the database **************************************");
    } catch (error) {
        return (error);
    }
}

// Returns lastCounter.
export const getLastCounter = async (db: KVStore): Promise<Counter> => {
    const encodedCounterInfo = await db.get(DB_LAST_COUNTER_INFO);
    return codec.decode<Counter>(counterSchema, encodedCounterInfo);
}

// Stores height of block where hello event exists.
export const setLastEventHeight = async (db: KVStore, lastHeight: number) => {
    try {
        const encodedHeightInfo = codec.encode(heightSchema, { height: lastHeight });
        await db.set(DB_LAST_HEIGHT_INFO, encodedHeightInfo);
        console.log("");
        console.log("************************************** Height saved successfully in the database **************************************");
        console.log("");
    } catch (error) {
        return (error);
    }
}

// Returns height of block where hello event exists.
export const getLastEventHeight = async (db: KVStore): Promise<Height> => {
    const encodedHeightInfo = await db.get(DB_LAST_HEIGHT_INFO);
    return codec.decode<Height>(heightSchema, encodedHeightInfo);
}

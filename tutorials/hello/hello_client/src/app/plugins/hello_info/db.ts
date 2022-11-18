/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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
export const getEventHelloInfo = async (db: KVStore, lastCounter: number): Promise<Event> => {
    try {
        let dbKey = cryptography.utils.intToBuffer(lastCounter, 4);
        dbKey = Buffer.concat([dbKey, Buffer.from(':', 'utf8'), DB_KEY_ADDRESS_INFO]);
        const encodedAddressInfo = await db.get(dbKey);
        return codec.decode<Event>(newHelloEventSchema, encodedAddressInfo);
    } catch (error) {
        return error;
    }
};

// Stores event's data in the database.
export const setEventHelloInfo = async (db: KVStore, _lskAddress: Buffer, _message: string, _eventHeight: number, lastCounter: number): Promise<Event> => {
    try {
        const encodedAddressInfo = codec.encode(newHelloEventSchema, { senderAddress: _lskAddress, message: _message, height: _eventHeight });
        let dbKey = cryptography.utils.intToBuffer(lastCounter, 4);
        dbKey = Buffer.concat([dbKey, Buffer.from(':', 'utf8'), DB_KEY_ADDRESS_INFO]);
        await db.set(dbKey, encodedAddressInfo);
        console.log("************************************** Event's Data saved successfully in the database **************************************");
    } catch (error) {
        return (error);
    }
};

// Stores lastCounter for key generation.
export const setLastCounter = async (db: KVStore, lastCounter: number) => {
    try {
        const encodedCounterInfo = codec.encode(counterSchema, { counter: lastCounter });
        await db.set(DB_LAST_COUNTER_INFO, encodedCounterInfo);
        console.log("************************************** Counter saved successfully in the database **************************************");
    } catch (error) {
        return (error);
    }
}

// Returns lastCounter.
export const getLastCounter = async (db: KVStore): Promise<Counter> => {
    try {
        const encodedCounterInfo = await db.get(DB_LAST_COUNTER_INFO);
        return codec.decode<Counter>(counterSchema, encodedCounterInfo);
    } catch (error) {
        return error;
    }
}

// Stores height of block where hello event exists.
export const setLastEventHeight = async (db: KVStore, lastHeight: number) => {
    try {
        const encodedHeightInfo = codec.encode(heightSchema, { height: lastHeight });
        await db.set(DB_LAST_HEIGHT_INFO, encodedHeightInfo);
        console.log("************************************** Height saved successfully in the database **************************************");
    } catch (error) {
        return (error);
    }
}

// Returns height of block where hello event exists.
export const getLastEventHeight = async (db: KVStore): Promise<Height> => {
    try {
        const encodedHeightInfo = await db.get(DB_LAST_HEIGHT_INFO);
        return codec.decode<Height>(heightSchema, encodedHeightInfo);
    } catch (error) {
        return error;
    }
}

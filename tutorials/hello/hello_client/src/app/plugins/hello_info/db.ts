/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as createDebug from 'debug';
import { codec, db as liskDB } from 'lisk-sdk';
import * as os from 'os';
import { join } from 'path';
import { ensureDir } from 'fs-extra';
import { addressSchema, counterSchema } from './schemas';
import { Address, Counter } from './types';
import { DB_KEY_ADDRESS_INFO, DB_LAST_COUNTER_INFO } from './constants';

const debug = createDebug('plugin:helloInfo:db');
const { Database } = liskDB;
type KVStore = liskDB.Database;

export const getDBInstance = async (
    dataPath: string,
    dbName = 'lisk-framework-helloInfo-plugin.db',
): Promise<KVStore> => {
    const dirPath = join(dataPath.replace('~', os.homedir()), 'plugins/data', dbName);
    await ensureDir(dirPath);
    return new Database(dirPath);
};

export const getAddressInfo = async (db: KVStore, lastCounter: number): Promise<Address> => {
    try {
        let dbKey = Buffer.from(lastCounter.toString());
        dbKey = Buffer.concat([dbKey, Buffer.from(':', 'utf8'), DB_KEY_ADDRESS_INFO]);
        const encodedAddressInfo = await db.get(dbKey);
        return codec.decode<Address>(addressSchema, encodedAddressInfo);
    } catch (error) {
        debug('Information does not exists');
        return {
            lskAddress: 'No Address found in the database!',
            byteAddress: Buffer.from('No Address found!', 'utf8')
        };
    }
};

export const setAddressInfo = async (db: KVStore, _lskAddress: string, _byteAddress: Buffer, lastCounter: number): Promise<any> => {
    try {
        const encodedAddressInfo = codec.encode(addressSchema, { lskAddress: _lskAddress, byteAddress: _byteAddress });
        let dbKey = Buffer.from(lastCounter.toString());
        dbKey = Buffer.concat([dbKey, Buffer.from(':', 'utf8'), DB_KEY_ADDRESS_INFO]);
        await db.set(dbKey, encodedAddressInfo);
        console.log("**************************************Address saved successfully in the database**************************************");
    } catch (error) {
        return (error);
    }
};

export const setLastCounter = async (db: KVStore, lastCounter: number) => {
    try {
        const encodedCounterInfo = codec.encode(counterSchema, { counter: lastCounter });
        await db.set(DB_LAST_COUNTER_INFO, encodedCounterInfo);
        console.log("**************************************Counter saved successfully in the database**************************************");
    } catch (error) {
        return (error);
    }
}

export const getLastCounter = async (db: KVStore): Promise<any> => {
    try {
        const encodedCounterInfo = await db.get(DB_LAST_COUNTER_INFO);
        return codec.decode<Counter>(counterSchema, encodedCounterInfo);
    } catch (error) {
        return error;
    }
}

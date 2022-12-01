/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { codec, db as liskDB, cryptography } from 'lisk-sdk';
import * as os from 'os';
import { join } from 'path';
import { ensureDir } from 'fs-extra';
import { offChainEventSchema, counterSchema, heightSchema } from './schemas';
import { Event, Counter, Height } from './types';
import { DB_KEY_EVENT_INFO, DB_LAST_COUNTER_INFO, DB_LAST_HEIGHT_INFO } from './constants';

const { Database } = liskDB;
type KVStore = liskDB.Database;

// Returns DB's instance.
export const getDBInstance = async (
	dataPath: string,
	dbName = 'lisk-framework-helloInfo-plugin.db',
): Promise<KVStore> => {
	const dirPath = join(dataPath.replace('~', os.homedir()), 'database', dbName);
	await ensureDir(dirPath);
	return new Database(dirPath);
};

// Returns event's data stored in the database.
export const getEventHelloInfo = async (db: KVStore): Promise<(Event & { id: Buffer })[]> => {
	// 1. Look for all the given key-value pairs in the database
	const stream = db.createReadStream({
		gte: Buffer.concat([DB_KEY_EVENT_INFO, Buffer.alloc(4, 0)]),
		lte: Buffer.concat([DB_KEY_EVENT_INFO, Buffer.alloc(4, 255)]),
	});
	// 2. Get event's data out of the collected stream and push it in an array.
	const results = await new Promise<(Event & { id: Buffer })[]>((resolve, reject) => {
		const events: (Event & { id: Buffer })[] = [];
		stream
			.on('data', ({ key, value }: { key: Buffer; value: Buffer }) => {
				events.push({
					...codec.decode<Event>(offChainEventSchema, value),
					id: key.slice(DB_KEY_EVENT_INFO.length),
				});
			})
			.on('error', error => {
				reject(error);
			})
			.on('end', () => {
				resolve(events);
			});
	});
	return results;
};

// Stores event data in the database.
export const setEventHelloInfo = async (
	db: KVStore,
	_lskAddress: Buffer,
	_message: string,
	_eventHeight: number,
	lastCounter: number,
): Promise<void> => {
	const encodedAddressInfo = codec.encode(offChainEventSchema, {
		senderAddress: _lskAddress,
		message: _message,
		height: _eventHeight,
	});
	// Creates a unique key for each event
	const dbKey = Buffer.concat([DB_KEY_EVENT_INFO, cryptography.utils.intToBuffer(lastCounter, 4)]);
	await db.set(dbKey, encodedAddressInfo);
	console.log('** Event data saved successfully in the database **');
};

// Stores lastCounter for key generation.
export const setLastCounter = async (db: KVStore, lastCounter: number): Promise<void> => {
	const encodedCounterInfo = codec.encode(counterSchema, { counter: lastCounter });
	await db.set(DB_LAST_COUNTER_INFO, encodedCounterInfo);
	console.log('** Counter saved successfully in the database **');
};

// Returns lastCounter.
export const getLastCounter = async (db: KVStore): Promise<Counter> => {
	const encodedCounterInfo = await db.get(DB_LAST_COUNTER_INFO);
	return codec.decode<Counter>(counterSchema, encodedCounterInfo);
};

// Stores height of block where hello event exists.
export const setLastEventHeight = async (db: KVStore, lastHeight: number): Promise<void> => {
	const encodedHeightInfo = codec.encode(heightSchema, { height: lastHeight });
	await db.set(DB_LAST_HEIGHT_INFO, encodedHeightInfo);
	console.log('**Height saved successfully in the database **');
};

// Returns height of block where hello event exists.
export const getLastEventHeight = async (db: KVStore): Promise<Height> => {
	const encodedHeightInfo = await db.get(DB_LAST_HEIGHT_INFO);
	return codec.decode<Height>(heightSchema, encodedHeightInfo);
};

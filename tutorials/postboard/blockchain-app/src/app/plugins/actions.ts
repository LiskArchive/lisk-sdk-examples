/*
 * Copyright © 2022 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */
import {
    codec,
    db,
    validator as liskValidator,
} from 'lisk-sdk';
import { addressIndexPluginStore, CreateUserListRequest, createUserListRequest, DeleteUserListRequest, deleteUserListRequest, GetUserListByAddressRequest, GetUserListByTopicRequest, getUserListByTopicRequest, getUserListsByAddressRequest, topicIndexPluginStore } from './schema';

const { validator, LiskValidationError } = liskValidator;

const stringToBuffer = (prefix: string) => 
    Buffer.from(prefix, 'utf-8');

const dbKey = (prefix: Buffer, key: Buffer) =>
    Buffer.concat([prefix, key]).toString('binary');

const DB_KEY_TOPIC = 'DB_KEY_TOPIC';
const DB_KEY_ADDRESS = 'DB_KEY_ADDRESS';

export class UserTrackerAcitons {
    private readonly _db: db.KVStore;

    public constructor(kvStore: db.KVStore ) {
        this._db = kvStore;
    }

    public async createUserList(params?: Record<string, unknown>): Promise<unknown> {
        if (!params) {
            throw new Error('Param is required.');
        }
        const errors = validator.validate(createUserListRequest, params)
        if (errors.length) {
            throw new LiskValidationError(errors);
        }
        const request = params as unknown as CreateUserListRequest;
        const topicKey = dbKey(stringToBuffer(DB_KEY_TOPIC), stringToBuffer(request.topic));
        try {
            const existing = await this._db.get(topicKey);
            const decodedValue = codec.decode<{addresses: Buffer[]}>(topicIndexPluginStore, existing);
            decodedValue.addresses.push(...request.addresses.map(address => Buffer.from(address, 'hex')));
            await this._db.put(topicKey, codec.encode(topicIndexPluginStore, decodedValue));
        } catch (error) {
            if (!(error instanceof db.NotFoundError)) {
                throw error;
            }
            await this._db.put(topicKey, codec.encode(topicIndexPluginStore, {
                addresses: request.addresses,
            }));
        }
        for (const address of request.addresses) {
            const addressKey = dbKey(stringToBuffer(DB_KEY_ADDRESS), Buffer.from(address, 'hex'));
            try {
                const existing = await this._db.get(addressKey);
                const decodedValue = codec.decode<{ topics: string[] }>(addressIndexPluginStore, existing);
                if (decodedValue.topics.findIndex(t => t === request.topic) === -1) {
                    decodedValue.topics.push(request.topic);
                    await this._db.put(topicKey, codec.encode(topicIndexPluginStore, decodedValue));
                }
            } catch (error) {
                if (!(error instanceof db.NotFoundError)) {
                    throw error;
                }
                await this._db.put(addressKey, codec.encode(addressIndexPluginStore, {
                    topics: [request.topic],
                }));
            }
        }
        return request;
    }

    public async deleteUserList(params?: Record<string, unknown>): Promise<unknown> {
        if (!params) {
            throw new Error('Param is required.');
        }
        const errors = validator.validate(deleteUserListRequest, params)
        if (errors.length) {
            throw new LiskValidationError(errors);
        }
        const request = params as unknown as DeleteUserListRequest;
        const topicKey = dbKey(stringToBuffer(DB_KEY_TOPIC), stringToBuffer(request.topic));
        const batch = this._db.batch();
        try {
            const existing = await this._db.get(topicKey);
            const decodedValue = codec.decode<{addresses: Buffer[]}>(topicIndexPluginStore, existing);
            batch.del(topicKey);
            for (const address of decodedValue.addresses) {
                const addressKey = dbKey(stringToBuffer(DB_KEY_ADDRESS), address);
                batch.del(addressKey);
            }
        } catch (error) {
            if (!(error instanceof db.NotFoundError)) {
                throw error;
            }
            return {};
        }
        await batch.write();

        return {};
    }

    public async getUserListByID(params?: Record<string, unknown>): Promise<{ addresses: string[]}> {
        if (!params) {
            throw new Error('Param is required.');
        }
        const errors = validator.validate(getUserListByTopicRequest, params)
        if (errors.length) {
            throw new LiskValidationError(errors);
        }
        const request = params as unknown as GetUserListByTopicRequest;
        const topicKey = dbKey(stringToBuffer(DB_KEY_TOPIC), stringToBuffer(request.topic));
        try {
            const existing = await this._db.get(topicKey);
            const decodedValue = codec.decode<{ addresses: Buffer[] }>(topicIndexPluginStore, existing);
            return {
                addresses: decodedValue.addresses.map(addr => addr.toString('hex')),
            }   
        } catch (error) {
            if (!(error instanceof db.NotFoundError)) {
                throw error;
            }
            return {
                addresses: [],
            };
        }
        
    }

    public async getUserListsByAddress(params?: Record<string, unknown>): Promise<{ topics: string[] }> {
        if (!params) {
            throw new Error('Param is required.');
        }
        const errors = validator.validate(getUserListsByAddressRequest, params)
        if (errors.length) {
            throw new LiskValidationError(errors);
        }
        const request = params as unknown as GetUserListByAddressRequest;
        const addressKey = dbKey(stringToBuffer(DB_KEY_ADDRESS), Buffer.from(request.address, 'hex'));
        try {
            const existing = await this._db.get(addressKey);
                const decodedValue = codec.decode<{ topics: string[] }>(addressIndexPluginStore, existing);
                return {
                    topics: decodedValue.topics,
                };
        } catch (error) {
            if (!(error instanceof db.NotFoundError)) {
                throw error;
            }
            return {
                topics: [],
            };
        }
    }
}
/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
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
 *
 */

/* eslint-disable class-methods-use-this */
import {
    BaseModule,
    codec,
    AfterGenesisBlockApplyContext,
    TransactionApplyContext
} from 'lisk-sdk';
import { CreateHelloAsset } from "./assets/create_hello_asset";

const {
    helloCounterSchema,
    helloAssetSchema,
    CHAIN_STATE_HELLO_COUNTER
} = require('./schemas');

export interface HelloAssetProps {
    helloString: "Hello World"
}

export class HelloModule extends BaseModule {
    public accountSchema = {
        type: 'object',
        properties: {
            helloMessage: {
                fieldNumber: 1,
                dataType: 'string',
                minLength: 3,
                maxLength: 64,
            },
        },
        default: {
            helloMessage: 'Hello World!',
        },
    };
    public actions = {
        amountOfHellos: async () => {
            let count = 0;
            const res = await this._dataAccess.getChainState(CHAIN_STATE_HELLO_COUNTER);
            if (res) {
                count = codec.decode(
                    helloCounterSchema,
                    res
                );
            }

            return count;
        },
    };
    public name = 'hello';
    public transactionAssets = [
        new CreateHelloAsset()
    ];
    public events = ['newHello'];
    public id = 1000;

    // Lifecycle hooks
    public async afterTransactionApply(_input: TransactionApplyContext) {
        // Publish a `newHello` event for every received hello transaction
        // 1. Check for correct module and asset IDs
        if (_input.transaction.moduleID === this.id && _input.transaction.assetID === 0) {

            // 2. Decode the transaction asset
            let helloAsset : HelloAssetProps;
            helloAsset = codec.decode(
                helloAssetSchema,
                _input.transaction.asset
            );

            // 3. Publish the event 'hello:newHello' and
            // attach information about the sender address and the posted hello message.
            this._channel.publish('hello:newHello', {
                sender: _input.transaction.senderAddress.toString('hex'),
                hello: helloAsset.helloString
            });
        }
    }

    public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
        // Set the hello counter to zero after the genesis block is applied
        await _input.stateStore.chain.set(
            CHAIN_STATE_HELLO_COUNTER,
            codec.encode(helloCounterSchema, { helloCounter: 0 })
        );
    }
}

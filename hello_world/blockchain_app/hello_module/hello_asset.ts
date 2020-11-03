const {
    BaseAsset,
    ValidationError,
    codec
} = require('lisk-sdk');
const {
    helloCounterSchema,
    CHAIN_STATE_HELLO_COUNTER
} = require('./schemas');

export class HelloAsset extends BaseAsset {
    name = 'helloAsset';
    id = 0;
    schema = {
        $id: '/hello/asset',
        type: 'object',
        required: ["hello"],
        properties: {
            hello: {
                dataType: 'string',
                fieldNumber: 1,
            },
        },
    };

    validate({asset}) {
        if (!asset.hello || typeof asset.hello !== 'string' || asset.hello.length > 64) {
            throw new ValidationError(
                'Invalid "asset.hello" defined on transaction: A string value no longer than 64 characters is expected',
                asset.hello,
            );
        }
    };

    async apply({ asset, stateStore, reducerHandler, transaction }) {
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);


        senderAccount.hello = asset.hello;
        stateStore.account.set(senderAccount.address, senderAccount);

        let counter = await stateStore.chain.get(
            CHAIN_STATE_HELLO_COUNTER
        );

        await stateStore.chain.set(
            CHAIN_STATE_HELLO_COUNTER,
            codec.encode(helloCounterSchema, ++counter)
        );
    }
}

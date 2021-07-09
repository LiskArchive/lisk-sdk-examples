import { BaseAsset, codec } from 'lisk-sdk';
//const { BaseAsset, ApplyAssetContext, ValidateAssetContext, codec } = require('lisk-sdk');
const {
    helloCounterSchema,
    CHAIN_STATE_HELLO_COUNTER
} = require('../schemas');

export class CreateHelloAsset extends BaseAsset {
    public name = 'createHello';
    public id = 0;

  // Define schema for asset
    public schema = {
        $id: 'lisk/hello/asset',
        type: 'object',
        required: ["helloString"],
        properties: {
            helloString: {
                dataType: 'string',
                fieldNumber: 1,
                minLength: 3,
                maxLength: 64,
            },
        }
    };

    public validate({ asset }): void {
      if (asset.helloString == "Some illegal statement") {
          throw new Error(
              'Illegal hello message: ${asset.helloString}'
          );
      }
    }

	// eslint-disable-next-line @typescript-eslint/require-await
    public async apply({ asset, transaction, stateStore }): Promise<void> {
        // 1. Get account data of the sender of the hello transaction
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);

        // 2. Update hello message in the senders account with thehelloString of the transaction asset
        senderAccount.hello.helloMessage = asset.helloString;
        stateStore.account.set(senderAccount.address, senderAccount);

        // 3. Get the hello counter from the database
        let counterBuffer = await stateStore.chain.get(
          CHAIN_STATE_HELLO_COUNTER
        );
        
        // 4. Decode the hello counter
        let counter = codec.decode(
          helloCounterSchema,
          counterBuffer
        );

        // 5. Increment the hello counter +1
        counter.helloCounter++;

        // 6. Encode the hello counter and save it back to the database
        await stateStore.chain.set(
          CHAIN_STATE_HELLO_COUNTER,
          codec.encode(helloCounterSchema, counter)
        );
    }
}

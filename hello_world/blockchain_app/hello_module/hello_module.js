const {
    BaseModule,
    TransactionApplyContext,
    AfterBlockApplyContext,
    BeforeBlockApplyContext,
    AfterGenesisBlockApplyContext,
} = require('lisk-sdk');
const { HelloAsset } = require('./hello_asset');

export class HelloModule extends BaseModule {
    name = 'hello';
    id = 1000;
    accountSchema = {
        type: 'object',
        properties: {
            hello: {
                fieldNumber: 1,
                dataType: 'string',
            },
        },
        default: {
            hello: '',
        },
    };
    transactionAssets: [new HelloAsset()];
    actions = {
        amountOfHellos: async (hello) => {
            this._channel.subscribe()
        },
    };
    events = ['someEvent','anotherEvent'];
    reducers = {};
    beforeTransactionApply(context: TransactionApplyContext): Promise<void> {
        // Code in here is applied before a transaction is applied.
        this._channel.publish('hello:someEvent', { info: 'sample' });
    };
    afterTransactionApply(context: TransactionApplyContext): Promise<void> {
        // Code in here is applied after a transaction is applied.
    };
    afterGenesisBlockApply(context: AfterGenesisBlockApplyContext): Promise<void> {
        // Code in here is applied after a genesis block is applied.
    };
    beforeBlockApply(context: BeforeBlockApplyContext): Promise<void> {
        // Code in here is applied before a block is applied.
    }
    afterBlockApply(context: AfterBlockApplyContext): Promise<void> {
        // Code in here is applied after a block is applied.
        this._channel.subscribe('app:chain:fork ', ({ data }) => {
            console.log(data);
        });
    }
}

class NFTModule extends BaseModule {
    name = "nft";
    id = 1000;
    transactionAssets = [new CreateNFT(), new TransferNFT(), new PurchaseNFT()];

    accountSchema = {
        type: "object",
        required: ["hello"],
        properties: {
            hello: {
                type: "string",
                fieldNumber: 1,
            },
        },
        default: {
            hello: "",
        },
    };

    actions = {
        helloAction: async () => {
            return this._dataAccess
        },
    };

    events = {
        helloAction: async () => {
            return this._dataAccess
        },
    };
}


module.exports = HelloModule;

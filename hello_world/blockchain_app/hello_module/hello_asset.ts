const {
    BaseAsset,
    ValidationError,
} = require('lisk-sdk');

interface Asset {
    Data: string;
}
export class HelloAsset extends BaseAsset {
    name = 'helloAsset';
    id = 0;
    schema = {
        $id: '/helloAsset',
        type: 'object',
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
                'Invalid "asset.hello" defined on transaction: A string value no longer than 64 characters',
                asset.hello,
            );
        }
    };

    async apply({ asset, stateStore, reducerHandler, transaction }) {
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);


        senderAccount.hello = this.hello;
        stateStore.account.set(senderAccount.address, senderAccount);


        const senderBalance = await reducerHandler.invoke("token:getBalance", {
            address: senderAddress,
        });
        const minRemainingBalance = await reducerHandler.invoke(
            "token:getMinRemainingBalance"
        );

        if (asset.initValue < minRemainingBalance) {
            throw new Error("NFT init value is too low.");
        }

        if (senderBalance < asset.initValue + minRemainingBalance) {
            throw new Error("Sender balance is not enough to create an NFT");
        }

        const nftToken = createNFTToken({
            ownerAddress: senderAddress,
            nonce: transaction.nonce,
            value: asset.initValue,
            minPurchaseMargin: asset.minPurchaseMargin,
        });

        senderAccount.nft.ownNFTs.push(nftToken.id);
        await stateStore.account.set(senderAddress, senderAccount);

        await reducerHandler.invoke("token:debit", {
            address: senderAddress,
            amount: asset.initValue,
        });

        const allTokens = await getAllNFTTokens(stateStore);
        allTokens.push(nftToken);
        await setAllNFTTokens(stateStore, allTokens);
    }
}

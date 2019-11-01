const RegisterPacketTransaction = require('../register-packet');
const transactions = require('@liskhq/lisk-transactions');
const { when } = require('jest-when');

const dateToLiskEpochTimestamp = date => (
    Math.floor(new Date(date).getTime() / 1000) - Math.floor(new Date(Date.UTC(2016, 4, 24, 17, 0, 0, 0)).getTime() / 1000)
);

describe('RegisterPacket Transaction', () => {
    let storeStub;
    beforeEach(() => {
        storeStub = {
            account: {
                get: jest.fn(),
                set: jest.fn(),
            },
        };
    });

    test('it should undo the state for register packet correctly', async () => {
        // Arrange
        const senderId = 'senderXYZ';
        const asset = {
            security: transactions.utils.convertLSKToBeddows('10'),
            minTrust: 0,
            postage: transactions.utils.convertLSKToBeddows('10'),
            packetId: 'not important',
        };

        const mockedPacketAccount = {
            address: 'xyz123',
        };
        const mockedSenderAccount = {
            address: 'abc123',
            balance: '10000000000', // 100 LSK
        };

        when(storeStub.account.get)
            .calledWith(asset.packetId)
            .mockReturnValue(mockedPacketAccount);

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new RegisterPacketTransaction({
            senderId,
            asset,
            recipientId: 'xyzL',
            timestamp: dateToLiskEpochTimestamp(new Date()),
        });
        tx.undoAsset(storeStub);
        
        // Assert
        expect(storeStub.account.set).toHaveBeenNthCalledWith(
            1,
            mockedPacketAccount.address,
            {
                address: mockedPacketAccount.address,
                balance: 0,
                asset: null,
            }
        );

        expect(storeStub.account.set).toHaveBeenNthCalledWith(
            2,
            mockedSenderAccount.address,
            {
                address: mockedSenderAccount.address,
                balance: new transactions.utils.BigNum(mockedSenderAccount.balance).add(
                    new transactions.utils.BigNum(asset.postage)
                ).toString()
            }
        );
    });
});

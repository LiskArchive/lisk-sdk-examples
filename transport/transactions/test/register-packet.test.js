/*
 * Copyright © 2020 Lisk Foundation
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
const RegisterPacketTransaction = require('../solutions/register-packet');
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
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const asset = {
            security: transactions.utils.convertLSKToBeddows('10'),
            minTrust: 0,
            postage: transactions.utils.convertLSKToBeddows('10'),
            packetId: 'not important',
            recipientId: 'xyzL',
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
            senderPublicKey,
            asset,
            timestamp: dateToLiskEpochTimestamp(new Date()),
        });
        tx.undoAsset(storeStub);

        // Assert
        expect(storeStub.account.set).toHaveBeenNthCalledWith(
            1,
            mockedSenderAccount.address,
            {
                address: mockedSenderAccount.address,
                balance: new transactions.utils.BigNum(mockedSenderAccount.balance).add(
                    new transactions.utils.BigNum(asset.postage)
                ).toString()
            }
        );

        expect(storeStub.account.set).toHaveBeenNthCalledWith(
            2,
            mockedPacketAccount.address,
            {
                address: mockedPacketAccount.address,
                balance: 0,
                asset: null,
            }
        );
    });
});

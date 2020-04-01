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
const HelloTransaction = require('../hello_transaction');
const {TransactionError, utils} = require('@liskhq/lisk-transactions');
const { when } = require('jest-when');

describe('Hello Transaction', () => {
    let storeStub;
    beforeEach(() => {
        storeStub = {
            account: {
                get: jest.fn(),
                set: jest.fn(),
            },
        };
    });

    it('should save the hello string in the senders account assets', async () => {
        // Arrange
        const asset = {
            hello: "my hello message",
        };

        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const mockedSenderAccount = {
            address: '16313739661670634666L',
            publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
            asset: {},
        };

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new HelloTransaction({
            senderPublicKey,
            asset,
            timestamp: utils.getTimeFromBlockchainEpoch(new Date()),
        });
        tx.applyAsset(storeStub);

        // Assert
        expect(storeStub.account.set).toHaveBeenCalledWith(
            mockedSenderAccount.address,
            {
                address: mockedSenderAccount.address,
                publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
                asset,
            }
        );
    });

    it('should reject the transaction, if the sender has already a hello string in their account.', async () => {
        // Arrange
        const asset = {
            hello: "my hello message",
        };
        const senderId = '16313739661670634666L';
        const senderPublicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
        const mockedSenderAccount = {
                address: '16313739661670634666L',
                publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
                asset: {
                    hello: "Hello world!"
                }
            };
        const errors = [];
        errors.push(
            new TransactionError(
                'You cannot send a hello transaction multiple times',
                mockedSenderAccount.asset.hello,
                '.asset.hello',
                asset.hello
            )
        );

        when(storeStub.account.get)
            .calledWith(senderId)
            .mockReturnValue(mockedSenderAccount);

        // Act
        const tx = new HelloTransaction({
            senderPublicKey,
            asset,
            timestamp: utils.getTimeFromBlockchainEpoch(new Date()),
        });

        // Assert
        expect(tx.applyAsset(storeStub)).toMatchObject(errors);
    });
});

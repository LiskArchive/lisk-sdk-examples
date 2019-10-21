const {
    BaseTransaction,
    TransactionError,
    utils
} = require('@liskhq/lisk-transactions');

class FinishTransportTransaction extends BaseTransaction {

    static get TYPE () {
        return 24;
    }

    static get FEE () {
        //return `${10 ** 8}`;
        return '0';
    };

    async prepare(store) {
        /**
         * Get packet account
         */
        await store.account.cache([
            {
                address: this.asset.packetId,
            }
        ]);
        /**
         * Get sender and recipient accounts of the packet
         */
        const pckt = store.account.get(this.asset.packetId);
        await store.account.cache([
            {
                address: pckt.carrier,
            },
            {
                address: pckt.sender,
            },
        ]);
    }

    validateAsset() {
        const errors = [];
        if (!this.asset.packetId || typeof this.asset.packetId !== 'string') {
            errors.push(
                new TransactionError(
                    'Invalid "asset.packetId" defined on transaction',
                    this.id,
                    '.asset.packetId',
                    this.asset.packetId
                )
            );
        }
        return errors;
    }

    applyAsset(store) {
        const errors = [];
        const packet = store.account.get(this.asset.packetId);
        const carrier = store.account.get(packet.asset.carrier);
        const sender = store.account.get(packet.asset.sender);
        // if the transaction has been signed by the packet recipient
        if (this.asset.senderId === packet.carrier) {
            // if the transport was a success
            if ( this.asset.status === "success") {
                /**
                 * Update the Carrier account:
                 * - Unlock security
                 * - Add porto & security to balance
                 * - Earn 1 trustpoint
                 */
                const carrierBalanceWithSecurityAndPorto = new utils.BigNum(carrier.balance).add(new utils.BigNum(packet.asset.security)).add(new utils.BigNum(packet.porto));
                const updatedTrust = sender.asset.trust ? sender.asset.trust + 1 : 1;
                const updatedCarrier = {
                    ...carrier,
                    balance: carrierBalanceWithSecurityAndPorto.toString(),
                    asset: {
                        lockedSecurity: '0',
                        trust: updatedTrust
                    }
                };
                store.account.set(carrier.address, updatedCarrier);
                /**
                 * Update the Packet account:
                 * - Remove porto from balance
                 * - Change status to "success"
                 */
                const updatedData = {
                    balance: '0',
                    asset: {
                        status: "success",
                    }
                };
                const newObj = {
                    ...packet,
                    ...updatedData
                };
                store.account.set(packet.address, newObj);
                return errors;
            }
            // if the transport failed
            /**
             * Update the Sender account:
             * - Add porto and security to balance
             */
            const senderBalanceWithSecurityAndPorto = new utils.BigNum(sender.balance).add(new utils.BigNum(packet.asset.security)).add(new utils.BigNum(packet.porto));
            const updatedSender = {
                ...sender,
                balance: senderBalanceWithSecurityAndPorto.toString(),
            };
            store.account.set(sender.address, updatedSender);
            /**
             * Update the Carrier account:
             * - Reduce trust by 1
             * - Set lockedSecurity to 0
             */
            const updatedTrust = carrier.asset.trust - 1;
            const updatedCarrier = {
                ...carrier,
                asset: {
                    trust: updatedTrust,
                    lockedSecurity: '0'
                },
            };
            store.account.set(carrier.address, updatedCarrier);
            /**
             * Update the Packet account:
             * - set status to "fail"
             * - Remove porto from balance
             */
            const updatedData = {
                balance: '0',
                asset: {
                    deliveryStatus: "fail",
                }
            };
            const newObj = {
                ...packet,
                ...updatedData
            };
            store.account.set(packet.address, newObj);

            return errors;
        }
        errors.push(
            new TransactionError(
                'FinishTransport transaction needs to be signed by the recipient of the packet',
                this.id,
                '.asset.recipient',
                this.asset.recipient
            )
        );

    }

    undoAsset(store) {
        const errors = [];
        const packet = store.account.get(this.asset.packetId);
        const carrier = store.account.get(packet.carrier);
        const sender = store.account.get(packet.sender);
        if ( this.asset.status === "success") {
            const carrierBalanceWithouSecurityAndPorto = new utils.BigNum(carrier.balance).sub(new utils.BigNum(packet.asset.security)).sub(new utils.BigNum(packet.asset.porto));
            const downdatedCarrier = {
                ...carrier,
                balance: carrierBalanceWithouSecurityAndPorto.toString(),
                asset: {
                    lockedSecurity: packet.asset.security,
                    trust: carrier.asset.trust - 1
                }
            };
            store.account.set(carrier.address, downdatedCarrier);

        } else {
            const senderBalanceWithoutSecurityAndPorto = new utils.BigNum(sender.balance).sub(new utils.BigNum(packet.asset.security)).add(new utils.BigNum(packet.asset.porto));
            const downdatedSender = {
                ...sender,
                balance: senderBalanceWithoutSecurityAndPorto.toString(),
            };
            store.account.set(sender.address, downdatedSender);
        }
        const downdatedData = {
            balance: packet.asset.porto,
            asset: {
                deliveryStatus: "ongoing",
            }
        };
        const oldObj = {
            ...packet,
            ...downdatedData
        };
        store.account.set(packet.address, oldObj);
        return errors;
    }
}

module.exports = FinishTransportTransaction;

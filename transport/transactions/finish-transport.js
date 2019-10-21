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
                address: this.recipientId,
            }
        ]);
        /**
         * Get sender and recipient accounts of the packet
         */
        const pckt = store.account.get(this.recipientId);
        await store.account.cache([
            {
                address: pckt.asset.carrier,
            },
            {
                address: pckt.asset.sender,
            },
        ]);
    }

    validateAsset() {
        const errors = [];
        if (!this.recipientId || typeof this.recipientId !== 'string') {
            errors.push(
                new TransactionError(
                    'Invalid "asset.packetId" defined on transaction',
                    this.id,
                    '.asset.packetId',
                    this.recipientId
                )
            );
        }
        return errors;
    }

    applyAsset(store) {
        const errors = [];
        const packet = store.account.get(this.recipientId);
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
                const carrierBalanceWithSecurityAndPorto = new utils.BigNum(carrier.balance).add(new utils.BigNum(packet.asset.security)).add(new utils.BigNum(packet.asset.porto));

                carrier.balance = carrierBalanceWithSecurityAndPorto.toString();
                carrier.asset.lockedSecurity = null;
                carrier.asset.trust = carrier.asset.trust ? ++carrier.asset.trust : 1;

                store.account.set(carrier.address, carrier);
                /**
                 * Update the Packet account:
                 * - Remove porto from balance
                 * - Change status to "success"
                 */
                packet.balance = '0';
                packet.asset.status = 'success';

                store.account.set(packet.address, packet);
                return errors;
            }
            // if the transport failed
            /**
             * Update the Sender account:
             * - Add porto and security to balance
             */
            const senderBalanceWithSecurityAndPorto = new utils.BigNum(sender.balance).add(new utils.BigNum(packet.asset.security)).add(new utils.BigNum(packet.asset.porto));

            sender.balance = senderBalanceWithSecurityAndPorto;

            store.account.set(sender.address, sender);
            /**
             * Update the Carrier account:
             * - Reduce trust by 1
             * - Set lockedSecurity to 0
             */
            const updatedTrust = carrier.asset.trust - 1;

            carrier.asset.trust = updatedTrust;
            carrier.asset.lockedSecurity = null;

            store.account.set(carrier.address, updatedCarrier);
            /**
             * Update the Packet account:
             * - set status to "fail"
             * - Remove porto from balance
             */
            packet.balance = '0';
            packet.asset.status = 'fail';

            store.account.set(packet.address, packet);

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
        const packet = store.account.get(this.recipientId);
        const carrier = store.account.get(packet.carrier);
        const sender = store.account.get(packet.sender);
        /* --- Revert successful transport --- */
        if ( this.asset.status === "success") {
            /* --- Revert carrier account --- */
            const carrierBalanceWithoutSecurityAndPorto = new utils.BigNum(carrier.balance).sub(new utils.BigNum(packet.asset.security)).sub(new utils.BigNum(packet.asset.porto));

            carrier.balance = carrierBalanceWithoutSecurityAndPorto.toString();
            carrier.asset.lockedSecurity = packet.asset.security;
            carrier.asset.trust--;

            store.account.set(carrier.address, carrier);

        /* --- Revert failed transport --- */
        } else {
            /* --- Revert sender account --- */
            const senderBalanceWithoutSecurityAndPorto = new utils.BigNum(sender.balance).sub(new utils.BigNum(packet.asset.security)).add(new utils.BigNum(packet.asset.porto));
            sender.balance = senderBalanceWithoutSecurityAndPorto.toString();
            store.account.set(sender.address, sender);
            /* --- Revert carrier account --- */
            carrier.asset.trust++;
            carrier.asset.lockedSecurity = packet.asset.security;
            store.account.set(carrier.address, carrier);
        }
        /* --- Revert packet account --- */
        packet.balance = packet.asset.porto;
        packet.asset.status = "ongoing";

        store.account.set(packet.address, packet);
        return errors;
    }
}

module.exports = FinishTransportTransaction;

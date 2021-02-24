const { createTransferTrx } = require('./utils/transactions/balance_transfer');
const { createRecoveryConfigTrs } = require('./utils/transactions/create_recovery_trx');
const { createInitiateRecoveryTrx } = require('./utils/transactions/initiate_trx');
const { createVouchRecoveryTrx } = require('./utils/transactions/vouch_trx');
const { getIPCClient } = require('./utils/api_client');
const { default: axios } = require('axios');

const getURL = (url, port = 4000) => `http://localhost:${port}${url}`;

const wait = async (timeInMS) => new Promise(resolve => {
    setTimeout(() => resolve()
        , timeInMS)
});

const run = async () => {
    console.log('Starting simulation...');
    const liskClient = await getIPCClient('srs-app', '~/.lisk');

    const { tx: transferTrx1 } = await createTransferTrx({
        moduleID: 2,
        assetID: 0,
        asset: {
            amount: BigInt(108489300000000),
            recipientAddress: Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex'),
            data: '',
        },
        passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
        fee: '200000',
        liskClient,
    });

    try {
        const { data, status } = await axios.post(getURL('/api/transactions'), transferTrx1);
        console.log('Transfer transaction 1 is done', data, status);
    } catch (error) {
        console.error('Error occurred', error.status);
        return;
    }

    await wait(10000);

    const { tx: transferTrx2 } = await createTransferTrx({
        moduleID: 2,
        assetID: 0,
        asset: {
            amount: BigInt(408489300000000),
            recipientAddress: Buffer.from('463e7e879b7bdc6a97ec02a2a603aa1a46a04c80', 'hex'),
            data: '',
        },
        passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
        fee: '200000',
        liskClient,
    });

    try {
        const { data, status } = await axios.post(getURL('/api/transactions'), transferTrx2);
        console.log('Transfer transaction 2 is done', data, status);
    } catch (error) {
        console.error('Error occurred', error.status);
        return;
    }

    await wait(10000);

    const { tx: transferTrx3 } = await createTransferTrx({
        moduleID: 2,
        assetID: 0,
        asset: {
            amount: BigInt(408489300000000),
            recipientAddress: Buffer.from('328d0f546695c5fa02105deb055cf2801d9b8ba1', 'hex'),
            data: '',
        },
        passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
        fee: '200000',
        liskClient,
    });

    try {
        const { data, status } = await axios.post(getURL('/api/transactions'), transferTrx3);
        console.log('Transfer transaction 3 is done', data, status);
    } catch (error) {
        console.error('Error occurred', error.status);
        return;
    }

    await wait(10000);

    const { tx: transferTrx4 } = await createTransferTrx({
        moduleID: 2,
        assetID: 0,
        asset: {
            amount: BigInt(408489300000000),
            recipientAddress: Buffer.from('6174515fa66c91bff1128913edd4e0f1de37cee0', 'hex'),
            data: '',
        },
        passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
        fee: '200000',
        liskClient,
    });

    try {
        const { data, status } = await axios.post(getURL('/api/transactions'), transferTrx4);
        console.log('Transfer transaction 4 is done', data, status);
    } catch (error) {
        console.error('Error occurred', error.status);
        return;
    }

    await wait(10000);

    const { tx: createRecoveryTrx } = await createRecoveryConfigTrs({
        moduleID: 1000,
        assetID: 0,
        asset: {
            friends: [
                Buffer.from('463e7e879b7bdc6a97ec02a2a603aa1a46a04c80', 'hex'),
                Buffer.from('328d0f546695c5fa02105deb055cf2801d9b8ba1', 'hex'),
                Buffer.from('6174515fa66c91bff1128913edd4e0f1de37cee0', 'hex'),
            ],
            delayPeriod: 100,
            recoveryThreshold: 2,
        },
        passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
        fee: '200000',
        liskClient,
    });

    try {
        const { data, status } = await axios.post(getURL('/api/transactions'), createRecoveryTrx);
        console.log('Create recovery transaction done', data, status);
    } catch (error) {
        console.error('Error occurred', error.status);
        return;
    }

    await wait(10000);

    const { tx: initiateRecoveryTrx } = await createInitiateRecoveryTrx({
        moduleID: 1000,
        assetID: 1,
        asset: {
            lostAccount: Buffer.from('d04699e57c4a3846c988f3c15306796f8eae5c1c', 'hex'),
        },
        passphrase: 'endless focus guilt bronze hold economy bulk parent soon tower cement venue',
        fee: '200000',
        liskClient,
    });

    try {
        const { data, status } = await axios.post(getURL('/api/transactions'), initiateRecoveryTrx);
        console.log('Initiate recovery transaction done', data, status);
    } catch (error) {
        console.error('Error occurred', error.status);
        return;
    }

    await wait(10000);

    const { tx: vouchRecoveryTrx } = await createVouchRecoveryTrx({
        moduleID: 1000,
        assetID: 2,
        asset: {
            lostAccount: Buffer.from('d04699e57c4a3846c988f3c15306796f8eae5c1c', 'hex'),
            rescuer: Buffer.from('9cabee3d27426676b852ce6b804cb2fdff7cd0b5', 'hex'),
        },
        passphrase: 'mushroom edit regular pencil ten casino wine north vague bachelor swim piece',
        fee: '200000',
        liskClient,
    });
    console.log(vouchRecoveryTrx)
    try {
        const { data, status } = await axios.post(getURL('/api/transactions'), vouchRecoveryTrx);
        console.log('Vouch recovery transaction done', data, status);
    } catch (error) {
        console.error('Error occurred', error.response.data);
        return;
    }
    await liskClient.disconnect();
}

run()
.then(() => {
    console.log('End of Simulation.');

})
.catch(err => {
    console.error(err);
    process.exit(1);
})

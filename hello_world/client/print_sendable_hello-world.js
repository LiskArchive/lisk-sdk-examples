const HelloTransaction = require('../hello_transaction');
const transactions = require('@liskhq/lisk-transactions');
const { EPOCH_TIME } = require('@liskhq/lisk-constants');


/**
 *  To directly send the printed transaction:
 *  > node print_sendable_hello-world.js | curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions
 *  Note: An node needs to run on port 4000 (the default one) before. If the node runs on a different port, adjust the query accordingly.
 */

const getTimestamp = () => {
    // check config file or curl localhost:4000/api/node/constants to verify your epoc time
    const millisSinceEpoc = Date.now() - Date.parse(EPOCH_TIME);
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return  parseInt(inSeconds);
};

const tx = new HelloTransaction({
    asset: {
        hello: 'world',
    },
    fee: `${transactions.utils.convertLSKToBeddows('1')}`,
    recipientId: '10881167371402274308L', //delegate genesis_100
    timestamp: getTimestamp(),
});

tx.sign('wagon stock borrow episode laundry kitten salute link globe zero feed marble');

console.log(tx.stringify());
process.exit(1);

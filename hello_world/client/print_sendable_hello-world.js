const createSendableTransaction = require('./create_sendable_transaction_base_trs');
const HelloTransaction = require('../hello_transaction');

/**
 *  To directly send the printed transaction:
 *  > node print_sendable_hello-world.js | curl -X POST -H "Content-Type: application/json" -d @- localhost:4000/api/transactions
 *  Note: An node needs to run on port 4000 (the default one) before. If the node runs on a different port, adjust the query accordingly.
 */
const getTimestamp = () => {
	const epochTime = "2016-05-24T17:00:00.000Z" //default epoch time
	// check config file or curl localhost:4000/api/node/constants to verify your epoc time
	const millisSinceEpoc = Date.now() - Date.parse(epochTime);
	const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
	return  parseInt(inSeconds);
}

let h = createSendableTransaction(HelloTransaction, {
	type: 10,
	asset: {
		hello: 'world',
	},
	fee: `${10 ** 8}`,
	recipientId: '10881167371402274308L', //delegate genesis_100
	senderPublicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
	passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
	timestamp: getTimestamp(),
});

console.log(h);
process.exit(1);

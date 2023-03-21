const { transactions } = require('@liskhq/lisk-client');
const { getMinFee } = require('./getMinFee');
const { dryRun } = require('./dry-run');

(async () => {
	// Replace this with your transaction 
	const txJSON = {"module":"token","command":"transfer","fee":"0","nonce":"3","senderPublicKey":"ec10255d3e78b2977f04e59ea9afd3e9a2ce9a6b44619ef9f6c47c29695b1df3","signatures":["500d192a25a2c7b340b5ae03471c329b174d7fb3b05d47aefd71f0c4b76e220fe2edc79efcc16b9f89ac61708bcb9755f78262f1b00439f52972422a94f69a07"],"params":{"tokenID":"0300000800000000","amount":"1000000000","recipientAddress":"lskoytn4jcgs2pjpy2vfsttt7g8eb9wwbaf6hxc27","data":"Happy Birthday!"},"id":"0f81c6442ad49313046d73a8eb96178ff0c16ee2d353c4005f982310cdbbe39e"};

	const minFee = await getMinFee(txJSON);

	console.log("The minimum fee for the given transaction is: ", minFee, " Beddows, i.e. ", transactions.convertBeddowsToLSK(minFee.toString()), " LSK.");

	const txWithFee = {
		...txJSON,
		fee: minFee.toString()
	}

	const result = await dryRun(txWithFee);

	console.log("Dry run result", result);
	process.exit(0);
})();




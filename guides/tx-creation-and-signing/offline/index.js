const { createTxOffline } = require('./create-offline');
const { signTx } = require('./sign-offline');
const { dryRun } = require('./dry-run');

(async () => {
	// 1. Create an unsigned transaction
	const tx = createTxOffline();
	console.log("Unsigned Transaction: ", tx);

	// 2. Sign the transaction
	const signedTx = signTx(tx);
	console.log("Signed Transaction: ", signedTx);

	// 3. Perform a dry-run for the signed transaction
	const dryRunResult = await dryRun(signedTx)
	console.log("Dry-Run Result: ", dryRunResult);

	process.exit(0);
})();
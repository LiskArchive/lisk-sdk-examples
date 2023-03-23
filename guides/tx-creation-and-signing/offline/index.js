const { createTxOffline } = require('./create-offline');
const { signTx } = require('./sign-offline');
const { dryRun } = require('./dry-run');

(async () => {
	const tx = createTxOffline();
	console.log("Unsigned Transaction: ", tx);

	const signedTx = signTx(tx);
	console.log("Signed Transaction: ", signedTx);

	const dryRunResult = await dryRun(signedTx)
	console.log("Dry-Run Result: ", dryRunResult);

	process.exit(0);
})();



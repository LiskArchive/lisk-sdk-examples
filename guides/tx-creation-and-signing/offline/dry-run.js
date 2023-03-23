const { getClient } = require('../api-client');

const dryRun = async (signedTransaction) => {
	const client = await getClient();
	const encTx = client.transaction.encode(signedTransaction);
	const result = await client.invoke('txpool_dryRunTransaction', { "transaction": encTx.toString("hex") });

	return result;
}

module.exports = { dryRun };
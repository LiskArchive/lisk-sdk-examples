const { getClient } = require('./api-client');

/**
 * Performs a dry-run for a given transaction.
 *
 * @param txJSON The transaction to dry-run in JSON format
 * @returns The result of the dry-run
 */
const dryRun = async (txJSON) => {
	const client = await getClient();

	const tx = client.transaction.fromJSON(txJSON);
	const encodedTx = client.transaction.encode(tx);

	const result = await client.invoke('txpool_dryRunTransaction',{"transaction":encodedTx.toString("hex") })

	return result;
};

module.exports = { dryRun };
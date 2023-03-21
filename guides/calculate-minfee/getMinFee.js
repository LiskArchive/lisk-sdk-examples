const { getClient } = require('./api-client');
/**
 * Returns the minimum fee for a transaction.
 *
 * @param txJSON The transaction to calculate the minimum fee for in JSON format
 * @returns The minimum fee for the given transaction
 */
const getMinFee = async (txJSON) => {
	const client = await getClient();

	const minFee = client.transaction.computeMinFee(txJSON);

	return minFee;
};

module.exports = { getMinFee };
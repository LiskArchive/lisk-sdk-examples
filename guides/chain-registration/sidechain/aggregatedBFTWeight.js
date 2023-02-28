const { apiClient } = require('@liskhq/lisk-client');

(async () => {
	// Update the path to point to your sidechain app data folder
	const sidechainClient = await apiClient.createIPCClient('~/.lisk/hello_client');
	const sidechainNodeInfo = await sidechainClient.invoke('system_getNodeInfo');
	// Get active validators from sidechain
	const bftParams = await sidechainClient.invoke('consensus_getBFTParameters', { height: sidechainNodeInfo.height });

	// Calculate the aggregated BFT weight
	let aggregateBFTWeight = BigInt(0);
	for (const validator of bftParams.validators) {
		aggregateBFTWeight += BigInt(validator.bftWeight);
	}

	console.log("certificateThreshold:");
	console.log("min:");
	console.log(aggregateBFTWeight/BigInt(3) + BigInt(1));
	console.log("max:");
	console.log(aggregateBFTWeight);
	process.exit(0);
})();
const { apiClient } = require('@liskhq/lisk-client');
// Update rpc endpoint to point to a mainchain node with enabled WS RPC API
const RPC_ENDPOINT = 'ws://142.93.230.246:4002/rpc-ws';

(async () => {
	const mainchainClient = await apiClient.createWSClient(RPC_ENDPOINT);
	const mainchainNodeInfo = await mainchainClient.invoke('system_getNodeInfo');
	// Get active validators from mainchain
	const {
		validators: mainchainActiveValidators,
		certificateThreshold: mainchainCertificateThreshold
	} = await mainchainClient.invoke('consensus_getBFTParameters', { height: mainchainNodeInfo.height });

 // Calculate the aggregated BFT weight
	let aggregateBFTWeight = BigInt(0);
	for (const validator of mainchainActiveValidators) {
		aggregateBFTWeight += BigInt(validator.bftWeight);
	}

	console.log("certificateThreshold:");
	console.log("min:");
	console.log(aggregateBFTWeight/BigInt(3) + BigInt(1));
	console.log("max:");
	console.log(aggregateBFTWeight);
	process.exit(0);
})();
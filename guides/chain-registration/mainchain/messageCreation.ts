const { writeFileSync, fs } = require('fs-extra');
const { apiClient } = require('@liskhq/lisk-client');

(async () => {

	const mainchainClient = await apiClient.createIPCClient('~/.lisk/pos-mainchain');
	const mainchainNodeInfo = await mainchainClient.invoke('system_getNodeInfo');
	// Get active validators from mainchain
	const {
		validators: mainchainActiveValidators,
		certificateThreshold: mainchainCertificateThreshold
	} = await mainchainClient.invoke('consensus_getBFTParameters', { height: mainchainNodeInfo.height });

	//Create Registration message parameters in JSON format
	const paramsJSON = {
		ownChainID: '03000008',
		ownName: 'sidechain_8',
		mainchainValidators: mainchainActiveValidators.map(v => ({
			blsKey: v.blsKey,
			bftWeight: v.bftWeight
		})).sort((a, b) => Buffer.from(a.blsKey, 'hex').compare(Buffer.from(b.blsKey, 'hex'))),
		mainchainCertificateThreshold,
	};

	// Registration message params
	const params = {
		ownChainID: Buffer.from(paramsJSON.ownChainID, 'hex'),
		ownName: paramsJSON.ownName,
		mainchainValidators: paramsJSON.mainchainValidators.map(v => ({
			blsKey: Buffer.from(v.blsKey, 'hex'),
			bftWeight: BigInt(v.bftWeight),
		})),
		mainchainCertificateThreshold: paramsJSON.mainchainCertificateThreshold.toString(),
	};

	// Save params and params as JSON in a file params.json
	writeFileSync('./params.json',  JSON.stringify({paramsJSON, params}));

	process.exit(0);
})();
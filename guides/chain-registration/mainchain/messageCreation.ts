const { writeFileSync, fs } = require('fs-extra');
const { apiClient } = require('@liskhq/lisk-client');
const { keys:blsKeys } = require('keys.json');
import { NodeInfo, BFTParametersJSON } from './extern_types';

(async () => {

	const mainchainClient = await apiClient.createIPCClient('~/.lisk/pos-mainchain');
	//const sidechainClient = await apiClient.createIPCClient('~/.lisk/apple');
	const mainchainNodeInfo = await mainchainClient.invoke('system_getNodeInfo');
	// Get active validators from mainchain
	const {
		validators: mainchainActiveValidators,
		certificateThreshold: mainchainCertificateThreshold
	} = await mainchainClient.invoke('consensus_getBFTParameters', { height: mainchainNodeInfo.height });

	const paramsJSON = {
		ownChainID: '03000008',
		ownName: 'sidechain_8',
		mainchainValidators: mainchainActiveValidators.map(v => ({
			blsKey: v.blsKey,
			bftWeight: v.bftWeight
		})).sort((a, b) => Buffer.from(a.blsKey, 'hex').compare(Buffer.from(b.blsKey, 'hex'))),
		mainchainCertificateThreshold,
	};

	writeFileSync('./sidechainValidatorsSignatures.json',  JSON.stringify(sidechainValidatorsSignatures));
	writeFileSync('./params.json',  JSON.stringify(paramsJSON));

	process.exit(0);
})();
import { cryptography } from '@liskhq/lisk-client';

const { writeFileSync, fs } = require('fs-extra');
const { apiClient } = require('@liskhq/lisk-client');
const { keys:blsKeys } = require('keys.json');
import { NodeInfo, BFTParametersJSON } from './extern_types';

(async () => {
	const { bls } = cryptography;
	let sidechainValidatorsSignatures;
	fs.readFile('sidechainValidatorsSignatures.json', (err, data) => {
		if (!err && data) {
			console.log("data");
			console.log(data);
			sidechainValidatorsSignatures = data;
		} else {

		}
	});

	// Create BLS public keys list
	const publicKeysList = sidechainValidatorsSignatures.map(v => v.publicKey);

	// Create an aggregated signature & aggregation bits
	const { aggregationBits, signature:sig } = bls.createAggSig(
		publicKeysList,
		sidechainValidatorsSignatures,
	);

	console.log('Result after creating aggregate signature:\n"aggregationBits": ', aggregationBits.toString('hex'), '\n"signature":', signature.toString('hex'));

	writeFileSync('./mainchain_reg_params.json',  JSON.stringify({ ...sidechainValidatorsSignatures.paramsJSON, signature: sig.toString('hex'), aggregationBits: aggregationBits.toString('hex')}));


	process.exit(0);
})();
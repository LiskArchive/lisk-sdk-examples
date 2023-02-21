import { cryptography, apiClient, codec } from '@liskhq/lisk-client';
import { registrationSignatureMessageSchema } from './schemas';
const { MESSAGE_TAG_CHAIN_REG } = require('./constants');
const { writeFileSync, fs } = require('fs-extra');
const { BFTParametersJSON } = require('./extern_types');

(async () => {
	const sidechainClient = await apiClient.createIPCClient('~/.lisk/apple');
	const sidechainNodeInfo = await sidechainClient.invoke('system_getNodeInfo');
	// Get active validators from sidechain
	const { validators } = await sidechainClient.invoke<typeof BFTParametersJSON>('consensus_getBFTParameters', { height: sidechainNodeInfo.height });

	const { bls } = cryptography;
	let sidechainValidatorsSignatures;

	fs.readFile('sidechainValidatorsSignatures.json', (err, data) => {
		if (!err && data) {
			console.log("data");
			console.log(data);
			sidechainValidatorsSignatures = data;
		} else {
			console.log("sidechainValidatorsSignatures.json missing.");
			process.exit(1);
		}
	});

	// Sort validators from sidechain
	sidechainValidatorsSignatures.sort((a, b) => a.publicKey.compare(b.publicKey));

	// Create BLS public keys list
	const publicKeysList = sidechainValidatorsSignatures.map(v => v.publicKey);

	// Create an aggregated signature & aggregation bits
	const { aggregationBits, signature } = bls.createAggSig(
		publicKeysList,
		sidechainValidatorsSignatures,
	);

	console.log('Result after creating aggregate signature:\n"aggregationBits": ', aggregationBits.toString('hex'), '\n"signature":', signature.toString('hex'));

	let params;
	let paramsJSON;
	//Read params
	fs.readFile('params.json', (err, data) => {
		if (!err && data) {
			console.log("params:");
			console.log(data);
			params = data.params;
			paramsJSON = data.paramsJSON;

			const message = codec.codec.encode(registrationSignatureMessageSchema, params);

			/*	****************** Signature verification ****************** */

			//Remove signatures of non-active validators
			//? Do we actually need to check this if we verify the signature in the end?
			for (const v of validators) {
				const validatorInfo = sidechainValidatorsSignatures.find(scValidator => scValidator.publicKey === v.publicKey);
				if (!validatorInfo) {
					//Remove validator signature from sidechainValidatorsSignatures
				}
			}

			// Create keys and weights lists
			const keys: Buffer[] = [];
			const weights: bigint[] = [];
			for (const validator of sidechainValidatorsSignatures) {
				keys.push(validator.publicKey);
				weights.push(BigInt(1));
			}

			// Verify the validity of the aggregated signature
			const verifyResult = bls.verifyWeightedAggSig(
				keys,
				aggregationBits,
				signature,
				MESSAGE_TAG_CHAIN_REG,
				params.ownChainID,
				message,
				weights,
				BigInt(68),
			)

			console.log('==SIGNATURE VERIFICATION RESULT====', verifyResult);
			/*		****************** ******************	*/

			console.log('Amount of signatures:', sidechainValidatorsSignatures.length);

			writeFileSync('./mainchain_reg_params.json',  JSON.stringify({ ...paramsJSON, signature: signature.toString('hex'), aggregationBits: aggregationBits.toString('hex')}));

		} else {
			console.log("params.json missing.");
			process.exit(1);
		}
	});

	console.log('Mainchain registration file is created at ./mainchain_reg_params.json successfully.');

	console.log(`Run below command to create transaction:\n "./bin/run transaction:create interoperability registerMainchain 20000000 --pretty -f ./mainchain_reg_params.json"`);

	// Now run transaction:create command
	/**
	 * 1. Run transaction:create command using the created params file
	 * CMD: ./bin/run transaction:create interoperability registerMainchain 20000000 --pretty -f ./mainchain_reg_params.json
	 * 2. Send or DryRun the transaction
	 * CMD: ./bin/run transaction:send <TX_HEX>
	 * 3. Call `chain_getEvents(height)` RPC for the block height the above transaction was included.
	 * 4. Call `chain_getBlockByHeight(height)` RPC to get the block in which the transaction was included.
	 * 5. Call `interoperability_getChainAccount(chainID)` RPC to get the mainchain account which was registered above.
	 */
	process.exit(0);
})();
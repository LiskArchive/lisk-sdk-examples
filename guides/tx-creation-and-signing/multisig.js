const { cryptography,codec } = require('@liskhq/lisk-client');
const { transactionSchema, registerMultisignatureParamsSchema } = require('./schemas');
const readline = require("readline");

let privateKeyStr;

// Public identifier of the account that is converted to multi-sig
const pubkey = "e57a23f897b13bdeef27439bb9f4e29ac0828018d27d6b39ade342879928b46a";

// Parameters
let paramsStr = {
	"numberOfSignatures": 2,
	"mandatoryKeys": [],
	"optionalKeys": [
		"61d320f822fcc163489499200ae6c99a66296513b1ca1066e49a37a026434ac0",
		"dfbe4e3999138d62047c23f61f222a91b24d9d056db055be24f9ab6d95d7aa78",
		"e57a23f897b13bdeef27439bb9f4e29ac0828018d27d6b39ade342879928b46a"
	],
	"signatures": []
};

let params = {
	...paramsStr,
	optionalKeys: [
		Buffer.from("61d320f822fcc163489499200ae6c99a66296513b1ca1066e49a37a026434ac0", "hex"),
		Buffer.from("dfbe4e3999138d62047c23f61f222a91b24d9d056db055be24f9ab6d95d7aa78","hex"),
		Buffer.from("e57a23f897b13bdeef27439bb9f4e29ac0828018d27d6b39ade342879928b46a","hex"),
	]
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
if (process.argv.length < 3) {
	console.log("Please provide all the required parameter when executing the script:");
	console.log("node mutisig.js PRIVATEKEY");
	process.exit(1);
}

console.log("Please only proceed to sign the registration message if you confirm the correctness of the following parameters for the multi-signature registration:");
console.log(paramsStr);

rl.question("Confirm parameters with 'yes'", function(confirmed) {
	confirmed = confirmed.toLowerCase();
	if (confirmed == "yes" || confirmed == "y") {
		process.argv.forEach(function (val,index) {
			if (index === 2) {
				privateKeyStr = val;
			}
		});

		const msTx = {
			module: 'auth',
			command: 'registerMultisignature',
			nonce: BigInt('2'),
			fee: BigInt('15000000'),
			senderPublicKey: Buffer.from(pubkey,"hex"),
			params: codec.codec.encode(registerMultisignatureParamsSchema, params),
			signatures: [],
		};

		const unsignedMultiSigTransaction = codec.codec.encode(transactionSchema, msTx);
		const chainIDStr = "02000000";
		const chainID = Buffer.from(chainIDStr, 'hex');
		const tag = 'LSK_RMSG_';
		const privateKey = Buffer.from(privateKeyStr,"hex");

		const signature = cryptography.ed.signDataWithPrivateKey(
			tag,
			chainID,
			unsignedMultiSigTransaction,
			privateKey,
		);

		console.log("Signature:");
		console.log(signature.toString("hex"));

		//params.signatures.push(signature);
		paramsStr.signatures.push(signature.toString("hex"))

		console.log("Parameters with the appended signature:");
		console.log(paramsStr);
	}

	rl.close();
});

rl.on("close", function() {
	console.log("\nBYE BYE !!!");
	process.exit(0);
});


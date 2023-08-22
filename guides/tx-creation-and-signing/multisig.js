const { cryptography,codec } = require('@liskhq/lisk-client');
const readline = require("readline");

// Public identifier of the account that is converted to multi-sig
const pubkey = "e57a23f897b13bdeef27439bb9f4e29ac0828018d27d6b39ade342879928b46a";

// Schemas
const registerMultisignatureParamsSchema = {
	$id: '/test/auth/command/regMultisig',
	type: 'object',
	properties: {
		numberOfSignatures: {
			dataType: 'uint32',
			fieldNumber: 1,
			minimum: 1,
			maximum: 64,
		},
		mandatoryKeys: {
			type: 'array',
			items: {
				dataType: 'bytes',
				minLength: 32,
				maxLength: 32,
			},
			fieldNumber: 2,
			minItems: 0,
			maxItems: 64,
		},
		optionalKeys: {
			type: 'array',
			items: {
				dataType: 'bytes',
				minLength: 32,
				maxLength: 32,
			},
			fieldNumber: 3,
			minItems: 0,
			maxItems: 64,
		},
		signatures: {
			type: 'array',
			items: {
				dataType: 'bytes',
				minLength: 64,
				maxLength: 64,
			},
			fieldNumber: 4,
		},
	},
	required: ['numberOfSignatures', 'mandatoryKeys', 'optionalKeys', 'signatures'],
};
const transactionSchema = {
	$id: '/lisk/transaction',
	type: 'object',
	required: ['module', 'command', 'nonce', 'fee', 'senderPublicKey', 'params'],
	properties: {
		module: {
			dataType: 'string',
			fieldNumber: 1,
			minLength: 1,
			maxLength: 32,
		},
		command: {
			dataType: 'string',
			fieldNumber: 2,
			minLength: 1,
			maxLength: 32,
		},
		nonce: {
			dataType: 'uint64',
			fieldNumber: 3,
		},
		fee: {
			dataType: 'uint64',
			fieldNumber: 4,
		},
		senderPublicKey: {
			dataType: 'bytes',
			fieldNumber: 5,
			minLength: 32,
			maxLength: 32,
		},
		params: {
			dataType: 'bytes',
			fieldNumber: 6,
		},
		signatures: {
			type: 'array',
			items: {
				dataType: 'bytes',
			},
			fieldNumber: 7,
		},
	},
};

let privateKeyStr;

// Parameters
let paramsStr = {
	"numberOfSignatures": 2,
	"mandatoryKeys": [],
	"optionalKeys": [
		"61d320f822fcc163489499200ae6c99a66296513b1ca1066e49a37a026434ac0",
		"dfbe4e3999138d62047c23f61f222a91b24d9d056db055be24f9ab6d95d7aa78"
	],
	"signatures": []
};
let params = {
	...paramsStr,
	optionalKeys: [
		Buffer.from("61d320f822fcc163489499200ae6c99a66296513b1ca1066e49a37a026434ac0", "hex"),
		Buffer.from("dfbe4e3999138d62047c23f61f222a91b24d9d056db055be24f9ab6d95d7aa78","hex")
	]
}

console.log("=============== params ===============");
console.log(params);

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

	/*	const decodedBaseTransaction = codec.codec.decode(
			transactionSchema,
			unsignedMultiSigTransaction,
		);

		console.log(decodedBaseTransaction);*/

		const signature = cryptography.ed.signDataWithPrivateKey(
			tag,
			chainID,
			unsignedMultiSigTransaction,
			privateKey,
		);

		console.log(signature);

		params.signatures.push(signature);

		console.log("Parameters with the appended signature:");
		console.log(params);
	}

	rl.close();
});

rl.on("close", function() {
	console.log("\nBYE BYE !!!");
	process.exit(0);
});


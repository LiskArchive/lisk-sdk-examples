// Sidechain registration on mainchain
const transactionCreate = './bin/run transaction:create interoperability registerSidechain 2000000000 --pretty --passphrase="economy cliff diamond van multiply general visa picture actor teach cruel tree adjust quit maid hurry fence peace glare library curve soap cube must" -f ../../../sidechain_registration.json';
/**
 * {
  "transaction": "0a10696e7465726f7065726162696c6974791211726567697374657253696465636861696e18002080a8d6b9072a20a3f96c50d0446220ef2f98240898515cbba8155730679ca35326d98dcfb680f032450a040400000112056170706c651a340a308ad1c516bf1da968f4f15418f50013346698476d0a2d7ed441d5c9dd353c8d09d79f0d9bfd5a05024eb5e06df3ccbc89100220023a40f785f7b81afda79b81886bfa292a99a4cdc0294a26ed129ab89d355440736ff463d2831ba757b2c6356728e8b84b900949ce75396eb9e063da6155abc65db500"
  }
 */
const transactionSend = './bin/run transaction:send 0a10696e7465726f7065726162696c6974791211726567697374657253696465636861696e18002080a8d6b9072a20a3f96c50d0446220ef2f98240898515cbba8155730679ca35326d98dcfb680f032450a040400000112056170706c651a340a308ad1c516bf1da968f4f15418f50013346698476d0a2d7ed441d5c9dd353c8d09d79f0d9bfd5a05024eb5e06df3ccbc89100220023a40f785f7b81afda79b81886bfa292a99a4cdc0294a26ed129ab89d355440736ff463d2831ba757b2c6356728e8b84b900949ce75396eb9e063da6155abc65db500';
/**
 * Transaction with id: '5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb' received by node.
 */
// Success event
const event = {
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "data": "0a14b2f75b6968f687b495b69e1fec51d06fa8ae9d8d12036665651a0804000000000000002080a8d6b9072800",
            "index": 0,
            "module": "token",
            "name": "lock",
            "topics": [
                "5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb",
                "b2f75b6968f687b495b69e1fec51d06fa8ae9d8d"
            ],
            "height": 10
        },
        {
            "data": "0a056170706c651248080010001a20e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8552220e05459f8b49c9ef9f0e5cfe34b32fb5694e5ed622018c0dfd0f83edcff1f2f751800",
            "index": 1,
            "module": "interoperability",
            "name": "chainAccountUpdated",
            "topics": [
                "5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb",
                "04000001"
            ],
            "height": 10
        },
        {
            "data": "0a5c0a10696e7465726f7065726162696c697479121d63726f7373436861696e436f6d6d616e64526567697374726174696f6e180020002a04040000003204040000013a170a056170706c651204040000011a0804000000000000004000",
            "index": 2,
            "module": "interoperability",
            "name": "ccmSendSuccess",
            "topics": [
                "5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb",
                "04000000",
                "04000001",
                "5c94f9cb00af9bdb8f68918ae881c548371c57bcc3744bd28717618a95fab7d4"
            ],
            "height": 10
        },
        {
            "data": "0a14b2f75b6968f687b495b69e1fec51d06fa8ae9d8d12036665651a0804000000000000002080a8d6b9072800",
            "index": 3,
            "module": "token",
            "name": "unlock",
            "topics": [
                "5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb",
                "b2f75b6968f687b495b69e1fec51d06fa8ae9d8d"
            ],
            "height": 10
        },
        {
            "data": "0a14b2f75b6968f687b495b69e1fec51d06fa8ae9d8d1208040000000000000018c0abf8dc032000",
            "index": 4,
            "module": "token",
            "name": "burn",
            "topics": [
                "5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb",
                "b2f75b6968f687b495b69e1fec51d06fa8ae9d8d"
            ],
            "height": 10
        },
        {
            "data": "0a14b2f75b6968f687b495b69e1fec51d06fa8ae9d8d1214debd5150d520df618398da340a04f922c9f8643a1a08040000000000000020c0fcdddc032800",
            "index": 5,
            "module": "token",
            "name": "transfer",
            "topics": [
                "5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb",
                "b2f75b6968f687b495b69e1fec51d06fa8ae9d8d",
                "debd5150d520df618398da340a04f922c9f8643a"
            ],
            "height": 10
        },
        {
            "data": "0a14b2f75b6968f687b495b69e1fec51d06fa8ae9d8d1214debd5150d520df618398da340a04f922c9f8643a18c0abf8dc0320c0fcdddc03",
            "index": 6,
            "module": "fee",
            "name": "generatorFeeProcessed",
            "topics": [
                "5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb",
                "b2f75b6968f687b495b69e1fec51d06fa8ae9d8d",
                "debd5150d520df618398da340a04f922c9f8643a"
            ],
            "height": 10
        },
        {
            "data": "0801",
            "index": 7,
            "module": "interoperability",
            "name": "commandExecutionResult",
            "topics": [
                "5b4fe843f649eded4ba8a620ebfb40d41d39e5c8b076c39a84094a6b3fdf20eb"
            ],
            "height": 10
        },
        {
            "data": "08001000",
            "index": 8,
            "module": "dynamicReward",
            "name": "rewardMinted",
            "topics": [
                "03",
                "debd5150d520df618398da340a04f922c9f8643a"
            ],
            "height": 10
        }
    ]
}

// call RPC to check if chain data state was created
// `interoperability_getChainAccount` with params "params": { "chainID": "04000001" }
const chainData = {
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
        "lastCertificate": {
            "height": 0,
            "timestamp": 0,
            "stateRoot": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "validatorsHash": "e05459f8b49c9ef9f0e5cfe34b32fb5694e5ed622018c0dfd0f83edcff1f2f75"
        },
        "name": "apple",
        "status": 0
    }
}
// call RPC to check if channel data state was created
// `interoperability_getChannel` with params "params": { "chainID": "04000001" }
const channelData = {
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
        "messageFeeTokenID": "0400000000000000",
        "outbox": {
            "appendPath": [
                "870a36b54c91dc8e986df628f5f85d86437e84fe3b33ab8f3e89d11ea73c8c0c"
            ],
            "root": "870a36b54c91dc8e986df628f5f85d86437e84fe3b33ab8f3e89d11ea73c8c0c",
            "size": 1
        },
        "inbox": {
            "appendPath": [],
            "root": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "size": 0
        },
        "partnerChainOutboxRoot": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
}
// call RPC to check if chain validator data state was created
// `interoperability_getChainValidators` with params "params": { "chainID": "04000001" }
const chainValidatorData = {
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
        "activeValidators": [
            {
                "blsKey": "8ad1c516bf1da968f4f15418f50013346698476d0a2d7ed441d5c9dd353c8d09d79f0d9bfd5a05024eb5e06df3ccbc89",
                "bftWeight": "2"
            }
        ],
        "certificateThreshold": "2"
    }
}
// call RPC to check if chain id available for the registered and it should return false
// `interoperability_isChainIDAvailable` with params "params": { "chainID": "04000001" } return false

// Mainchain registration on sidechain
const cmd = './bin/run transaction:create interoperability registerMainchain 2000000000 --pretty --passphrase="mango negative chat fence kingdom slot beyond venture expire pepper kitten amazing neutral amount genius census vacant inspire state zero essence gorilla turtle logic" -f ./config/default/mainchainRegistration.json'
const CHAIN_STATE_HELLO_COUNTER = "hello:helloCounter";

const helloCounterSchema = {
    $id: "lisk/hello/counter",
    type: "object",
    required: ["helloCounter"],
    properties: {
        helloCounter: {
            dataType: "number",
            fieldNumber: 1,
        },
    },
    default: {
        helloCounter: 0,
    },
};


module.exports = {
    CHAIN_STATE_HELLO_COUNTER,
    helloCounterSchema,
};

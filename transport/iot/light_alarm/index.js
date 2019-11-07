const PIN = require("rpi-pins");
const GPIO = new PIN.GPIO();
// Rpi-pins uses the WiringPi pin numbering system (check https://pinout.xyz/pinout/pin16_gpio23)
GPIO.setPin(4, PIN.MODE.INPUT);
const LightAlarmTransaction = require('./light-alarm');
const { APIClient } = require('@liskhq/lisk-api-client');

// Enter here the IP of the node you want to reach for API requests
const api = new APIClient(['http://localhost:4000']);

// Check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
const dateToLiskEpochTimestamp = date => (
    Math.floor(new Date(date).getTime() / 1000) - Math.floor(new Date(Date.UTC(2016, 4, 24, 17, 0, 0, 0)).getTime() / 1000)
);

/* Note: Always update to the package you are using */
const packetCredentials = { address: '5090763841295658446L',
    passphrase:
        'that cost affair hungry brain coil tiger similar van notable hen soup',
    publicKey:
        'a206204c9eedabb190a1759be2b816eb0934a18ebee70d9c014d2a55842f88f3',
    privateKey:
        '5a2e6d7fc3996f800a7385e23e6243210193eeb73c83d4636d1aad157386a477a206204c9eedabb190a1759be2b816eb0934a18ebee70d9c014d2a55842f88f3'
};

setInterval(() => {
	let state = GPIO.read(4);
	if(state === 1) {
		console.log('Package has been opened! Send lisk transaction!');
        let tx =  new LightAlarmTransaction({
            timestamp: dateToLiskEpochTimestamp(new Date())
        });

        tx.sign(packetCredentials.passphrase); // Signed by package

        api.transactions.broadcast(tx.toJSON()).then(res => {
            console.log("++++++++++++++++ API Response +++++++++++++++++");
            console.log(res.data);
            console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
            console.log(tx.stringify());
            console.log("++++++++++++++++ End Script +++++++++++++++++");
        }).catch(err => {
            console.log(JSON.stringify(err.errors, null, 2));
        });
	} else {
		console.log('Alles gut');
	}
}, 1000);

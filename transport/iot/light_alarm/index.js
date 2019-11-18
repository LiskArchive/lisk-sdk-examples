const PIN = require("rpi-pins");
const GPIO = new PIN.GPIO();
// Rpi-pins uses the WiringPi pin numbering system (check https://pinout.xyz/pinout/pin16_gpio23)
GPIO.setPin(4, PIN.MODE.INPUT);
const LightAlarmTransaction = require('./light-alarm');
const { APIClient } = require('@liskhq/lisk-api-client');

// Enter here the IP of the node you want to reach for API requests
// Check the IP by running `ifconfig` inside your local terminal
const api = new APIClient(['http://localhost:4000']);

// Check config file or curl localhost:4000/api/node/constants to verify your epoc time (OK when using /transport/node/index.js)
const dateToLiskEpochTimestamp = date => (
    Math.floor(new Date(date).getTime() / 1000) - Math.floor(new Date(Date.UTC(2016, 4, 24, 17, 0, 0, 0)).getTime() / 1000)
);

/* Note: Always update to the package you are using */
const packetCredentials = { /* Insert packet credentials here (retrieved from "Initialize" page of the client app) */};

setInterval(() => {
	let state = GPIO.read(4);
	if(state === 0) {
		console.log('Package has been opened! Send lisk transaction!');
		// Uncomment the below code in step 1.3 of the workshop
        /*let tx =  new LightAlarmTransaction({
            timestamp: dateToLiskEpochTimestamp(new Date())
        });

        tx.sign(packetCredentials.passphrase);

        api.transactions.broadcast(tx.toJSON()).then(res => {
            console.log("++++++++++++++++ API Response +++++++++++++++++");
            console.log(res.data);
            console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
            console.log(tx.stringify());
            console.log("++++++++++++++++ End Script +++++++++++++++++");
        }).catch(err => {
            console.dir(err);
        });*/
	} else {
		console.log('Alles gut');
	}
}, 1000);

const PIN = require("rpi-pins");
const GPIO = new PIN.GPIO();
// Rpi-pins uses the WiringPi pin numbering system (check https://pinout.xyz/pinout/pin16_gpio23)
GPIO.setPin(4, PIN.MODE.INPUT);
const LightAlarmTransaction = require('./light-alarm');
const { APIClient } = require('@liskhq/lisk-api-client');
const {getNetworkIdentifier} = require('@liskhq/lisk-cryptography');

const networkIdentifier = getNetworkIdentifier(
	"19074b69c97e6f6b86969bb62d4f15b888898b499777bda56a3a2ee642a7f20a",
	"Lisk",
);
// Enter here the IP of the node you want to reach for API requests
// Check the IP by running `ifconfig` inside your local terminal
const api = new APIClient(['http://localhost:4000']);

/* Note: Always update to the package you are using */
const packetCredentials = { /* Insert packet credentials here (retrieved from "Initialize" page of the client app) */};


setInterval(() => {
	let state = GPIO.read(4);
	if(state === 0) {
		console.log('Package has been opened! Send lisk transaction!');

		// Uncomment the below code in step 1.3 of the workshop
        /*api.accounts.get({address: packetCredentials.address}).then(response1 => {

			let tx =  new LightAlarmTransaction({
				asset: {
					timestamp: new Date().getTime() / 1000
				},
				fee: transactions.utils.convertLSKToBeddows('0.01'),
				nonce: response1.data[0].nonce
			});

            tx.sign(networkIdentifier, packetCredentials.passphrase);

	        api.transactions.broadcast(tx.toJSON()).then(res => {
	            console.log("++++++++++++++++ API Response +++++++++++++++++");
	            console.log(res.data);
	            console.log("++++++++++++++++ Transaction Payload +++++++++++++++++");
	            console.log(tx.stringify());
	            console.log("++++++++++++++++ End Script +++++++++++++++++");
	        }).catch(err => {
	            console.dir(err);
	        });
        });*/
	} else {
		console.log('Alles gut');
	}
}, 1000);

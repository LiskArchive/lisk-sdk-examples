const PIN = require("rpi-pins");
const GPIO = new PIN.GPIO();
// rpi-pins uses the WiringPi pin numbering system (check https://pinout.xyz/pinout/pin16_gpio23)
GPIO.setPin(4, PIN.MODE.INPUT); 


setInterval(() => {
	let state = GPIO.read(4);
	if(state === 1) {
		console.log('Package has been opened! Send lisk transaction!');
		console.log();
	} else {
		console.log('Alles gut');
	}
}, 500);
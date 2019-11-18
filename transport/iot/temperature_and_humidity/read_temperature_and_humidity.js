const rpiDhtSensor = require('rpi-dht-sensor');
// This library uses BCM pin numbering system (check https://pinout.xyz/pinout/pin7_gpio4)
const dht = new rpiDhtSensor.DHT22(4);

console.log('THIS SCRIPT NEEDS TO BE RUN AS ROOT!');

function readSensor () {
  const sensorData = dht.read();
    const temperatureAndHumidity = {
    	temperature: sensorData.temperature.toFixed(2),
	humidity: sensorData.humidity.toFixed(2)
    };
    console.log('Include your custom transaction here for sending the data to the Blockchain!');
    console.log(temperatureAndHumidity);
    setTimeout(readSensor, 3000);
}
readSensor();
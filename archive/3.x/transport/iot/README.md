# Scripts for reading sensors in a Raspberry Pi Zero W

This folder contains two folders for reading the output of two types of different sensors wired to a Rasperry Pi Zero W.

* The folder `package_alarm` includes the required script for reading a "light sensor"
* The folder `temperature_and_humidity` includes the required script for reading a `DHT22` temperature and humidity sensor

For using any of these scripts copy all the contents of the desired folder into the Raspberry Pi and run `npm i` after npm is done you can call the script to read the sensor values.


For wiring both sensors check the following image: 
![alt text][logo]

[logo]: https://raw.githubusercontent.com/LiskHQ/lisk-sdk-examples/lisk-transport/transport/client/rpi_scripts/lisk_rpi_ldr_and_temperature_sensors_wiring.png "Wiring diagram for sensors"
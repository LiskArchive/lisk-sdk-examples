const { Application, configDevnet, utils } = require('lisk-sdk');
const genesisBlockDevnet = require('./genesis-block');
const { HelloModule } = require('./hello_module');
const { HelloAPIPlugin } = require('./hello_plugin');

// Update genesis block accounts to include the hello attribute
genesisBlockDevnet.header.asset.accounts = genesisBlockDevnet.header.asset.accounts.map(
    (a) =>
        utils.objects.mergeDeep({}, a, {
            hello: {
                helloMessage: ''
            },
        }),
);

// Create a custom config based on the configDevnet
const appConfig = utils.objects.mergeDeep({}, configDevnet, {
    label: 'hello-app',
    genesisConfig: { communityIdentifier: 'hello' },
    rpc: {
        enable: true,
        mode: 'ws',
        port: 8888,
    },
    network: {
        port: 8887,
    },
    logger: {
        consoleLogLevel: 'info',
    },
});

// Create the application instance
const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

// Register Modules
app.registerModule(HelloModule);

// Register Plugins
app.registerPlugin(HelloAPIPlugin);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});

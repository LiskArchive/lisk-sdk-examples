const { Application, configDevnet, utils, HTTPAPIPlugin} = require('lisk-sdk');
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
    logger: {
        consoleLogLevel: 'info',
    },
});

const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

app.registerModule(HelloModule);

app.registerPlugin(HTTPAPIPlugin);
app.registerPlugin(HelloAPIPlugin);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});

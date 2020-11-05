const { Application, genesisBlockDevnet, configDevnet, utils} = require('lisk-sdk');
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

const app = new Application(genesisBlockDevnet, appConfig);


app.registerModule(HelloModule);
app.registerPlugin(HelloAPIPlugin);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});

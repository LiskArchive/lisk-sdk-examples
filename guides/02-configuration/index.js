const { Application, configDevnet, genesisBlockDevnet, utils } = require('lisk-sdk');

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

app
  .run()
  .then(() => app.logger.info('App started...'))
  .catch(error => {
    console.error('Faced error in application', error);
    process.exit(1);
  });

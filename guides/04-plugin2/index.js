const { Application, genesisBlockDevnet, configDevnet, utils } = require('lisk-sdk');
const { MyPlugin } = require('./my-plugin.js');

// Create a custom config based on the configDevnet
const appConfig = utils.objects.mergeDeep({}, configDevnet, {
  label: 'my-app',
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

const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

app.registerPlugin(MyPlugin);

app
  .run()
  .then(() => app.logger.info('App started...'))
  .catch(error => {
    console.error('Faced error in application', error);
    process.exit(1);
  });

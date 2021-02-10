const { Application, genesisBlockDevnet, configDevnet, utils } = require('lisk-sdk');

const appConfig = utils.objects.mergeDeep({}, configDevnet, {
  label: 'my-app',
  rpc: {
    enable: true,
    mode: "ws",
    port: 8080
  },
});

const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

app
  .run()
  .then(() => app.logger.info('App started...'))
  .catch(error => {
    console.error('Faced error in application', error);
    process.exit(1);
  });

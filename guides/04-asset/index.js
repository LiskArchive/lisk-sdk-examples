const { Application, genesisBlockDevnet, configDevnet, utils } = require('lisk-sdk');
const { MyModule } = require('./my-module.js');

// Update genesis block accounts to include the hello attribute
genesisBlockDevnet.header.asset.accounts = genesisBlockDevnet.header.asset.accounts.map(
  (a) =>
    utils.objects.mergeDeep({}, a, {
      myModule: {
        key1 : "",
        key2 : false,
        key3 : 0
      },
    }),
);

// Set a custom label for the bblockchain app
configDevnet.label = 'my-app';

const app = Application.defaultApplication(genesisBlockDevnet, configDevnet);

app.registerModule(MyModule);

app
  .run()
  .then(() => app.logger.info('App started...'))
  .catch(error => {
    console.error('Faced error in application', error);
    process.exit(1);
  });

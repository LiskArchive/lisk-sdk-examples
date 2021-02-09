const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
const { MyModule } = require('./my-module.js');
console.log(MyModule);
const app = Application.defaultApplication(genesisBlockDevnet, configDevnet);

app.registerModule(MyModule);

app
  .run()
  .then(() => app.logger.info('App started...'))
  .catch(error => {
    console.error('Faced error in application', error);
    process.exit(1);
  });

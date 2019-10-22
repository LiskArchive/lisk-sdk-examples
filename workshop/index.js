const { Application, genesisBlockDevnet, configDevnet } = require("lisk-sdk");
// @todo uncomment these accordingly, during the workshop
// const { InvoiceTransaction } = require('./transactions/index');
// const { PaymentTransaction } = require('./transactions/index');

const app = new Application(genesisBlockDevnet, configDevnet);

// @todo uncomment these accordingly, during the workshop
// app.registerTransaction(InvoiceTransaction);
// app.registerTransaction(PaymentTransaction);

app
  .run()
  .then(() => app.logger.info("App started..."))
  .catch(error => {
    console.error("Faced error in application", error);
    process.exit(1);
  });

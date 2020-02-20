To get started, create your docker image:
```
docker build -t lisk-sdk --build-arg user_name=$USER --build-arg user_id=$UID .
```

Now bring everything up:
```
docker-compose up -d
```

You'll now have Postgres running and a development environment container running
To see: `docker ps` and copy the ID of the `lisk-sdk` container.

You can enter the environment with `docker exec -it <name_or_id_of_container_here> /bin/bash`

And you should be able to access Postgres from within the environment:
```
psql -d lisk_dev -h db -U lisk
```

# Open Code in Editor
By default, the storage of the `lisk-sdk` container is mounted where you have exeucted the docker build command.

Open up this location and navigate inside `/dev_environment`.
Next, we need to clone the lisk-sdk-examples repository inside the `/dev_environment`.

Next, we need to make a small change to the `index.js` file inside the `/dev_environment/workshop` folder.

Add this line: 

```js
configDevnet.components.storage.host = 'db';
```

You'll get the following content for the index.js file:

```js
const { Application, genesisBlockDevnet, configDevnet } = require('lisk-sdk');
// @todo uncomment these accordingly, during the workshop
// const { InvoiceTransaction } = require('./transactions/index');
// const { PaymentTransaction } = require('./transactions/index');

configDevnet.components.storage.host = 'db';
const app = new Application(genesisBlockDevnet, configDevnet);

// @todo uncomment these accordingly, during the workshop
// app.registerTransaction(InvoiceTransaction);
// app.registerTransaction(PaymentTransaction);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});

```

We need to modify the host as Postgres is running in this container with host `db`.

Verify if the installation works by entering the lisk-sdk container with `docker exec -it <name_or_id_of_container_here> /bin/bash` and navigate inside the `/workshop` foldr.

Run `node index.js | npx bunyan -o short` - if no errors are displayed the installation is working correctly.

# Prerequisites
- Latest Docker version installed (for [Windows](https://docs.docker.com/docker-for-windows/install/) or [Mac](https://docs.docker.com/v17.12/docker-for-mac/install/))

**Note for Windows: Make sure Hyper-V is disabled (Docker will tell you if this is not the case).**

# Usage
This script is used for setting up all needed dependencies for participating in the workshop. 
The script will spin up a Postgres database and a separate lisk-sdk image on which the `lisk-sdk-examples` are cloned.

Note: In order to restart the node, you have to login into the container and restart the node there. This is the only disadvantage and will be explained later on in the `Installation` section.

# Installation
Clone the Lisk-SDK-Examples respository locally for this tutorial.

```bash
git clone https://github.com/LiskHQ/lisk-sdk-examples.git
cd lisk-sdk-examples
cd transport
```

## Build Docker Image for Windows
Next, we want to build the Docker image.
Make sure to use the normal Windows terminal, not the Git Bash terminal.
```bash
docker build -t lisk-sdk --build-arg user_id=1000 .
```

## Build Docker Image for Other Operation Systems
Next, we want to build the Docker image:
```bash
docker build -t lisk-sdk --build-arg user_id=$UID .
```

## Spin up with Docker-Compose
Now bring everything up using the Docker Compose file:
```bash
docker-compose up -d
```

**Note: If you are running this on Windows, Docker might ask you to give permisson to mount a volume to your host machine.**

## Verify Docker Containers 
You'll now have `Postgres` container and a `lisk-sdk` container running.
To verify, execute the following command and look for `transport_sdk_1` and `transport_db_1` container names.

```bash
docker ps
```

## Verify Lisk-SDK Container
You can enter the terminal of the lisk-sdk container with:

```bash
docker-compose exec sdk /bin/bash
```

Try to execute the `ls` command. The `/transport` folder of the `lisk-sdk-examples` should be mounted.
Therefore, you should see folders like `node`, `iot`, `transactions`, ...
```bash
ls
```

### Install Dependencies
Next, we have to install the required dependencies:
```bash
cd transactions
npm install
cd ../node
npm install
```

### Change Postgres Host
In order to be able to connect to the Postgres container, we have to add one configuration line to the `index.js` file inside the `/node` folder. Navigate inside the `/node` folder.

```bash
cd node
```

Next, open the `index.js` file in vim editor.

```bash
vim index.js
```

In order to change text with vim, we have to hit `i`.
You can exit the editing mode by hitting the `esc` key.
In order to save and exit the file, type `:wq` and hit enter.

Now, uncomment the following line in the `index.js` file.

```js
configDevnet.components.storage.host = 'db';
```

Save and exit the file with `:wq`.

### Check Postgres connection
We need to be able to access the Postgres database from the lisk-sdk container.
When executing the below command, your terminal should change and display the psql terminal of the Postgres container.
```
PGPASSWORD=password psql -d lisk_dev -h db -U lisk
```

You can exit this terminal with:
```
\q
```
This will bring you back to the terminal of the lisk-sdk container.

### Verify Running Node
On the lisk-sdk container, navigate inside the `/node` folder. Notice that all `node_modules` have been installed already.
You can start the node with the below command. The node will start to run and print logs.
In case the node crashes, make sure to ask for help! Be aware, spinning up the node can take some time (up to 3min).

```bash
node index.js | npx bunyan -o short
```

# Open Code in Editor
In order to modify the code, you can open your favourite editor on your **host machine**.
Open the `/lisk-sdk-examples/transport` file in your editor.

**Remember: In order to stop/start the node whenever you make changes, you have to use the `docker-compose exec sdk /bin/bash` command to access the terminal of the lisk-sdk container.**

# Take Down Docker Containers
You can simply take down the containers by executing the following command on your **host machine** inside the `/lisk-sdk-examples/transport` folder.

```sh
docker-compose down --volumes
```

You are all set to continue with the [Lisk Transport workshop](./Workshop2.adoc)! :)

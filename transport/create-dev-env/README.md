# Prerequisites
- Latest Docker version installed (for [Windows](https://docs.docker.com/docker-for-windows/install/) or [Mac](https://docs.docker.com/v17.12/docker-for-mac/install/))

**Note for Windows: Make sure Hyper-V is disabled (Docker will tell you if this is not the case).**

# Usage
This script is used for setting up all needed dependencies for participating in the workshop. 
The script will spin up a Postgres database and a separate ubuntu image on which the `lisk-sdk-examples` are cloned.
All of this happens with Docker. The ubuntu image (called `lisk-sdk`) will be mounted to this folder called `dev_environment`.
This mount allows you to open up the code from inside the Docker container with your preferred editor on your local machine.

Note: In order to restart the node, you have to login into the container and restart the node there. This is the only disadvantage and will be explained later on in the `Installation` section.

# Installation
First of all, navigate with your terminal inside the `/create-dev-env` folder.

```bash
cd create-dev-env`
```

To get started, create your docker image:
```bash
docker build -t lisk-sdk --build-arg user_name=$USER --build-arg user_id=$UID .
```

Now bring everything up using the Docker Compose file:
```bash
docker-compose up -d
```

**Note: If you are running this on Windows, Docker might ask you to give permisson to mount a volume to your host machine.

You'll now have Postgres running and a development environment container running
To see: `docker ps` and copy the ID of the `lisk-sdk` container.

You can enter the environment with `docker exec -it <container ID> /bin/bash`

And you should be able to access Postgres from within the environment:
```
psql -d lisk_dev -h db -U lisk
```

# Open Code in Editor
By default, the storage of the `lisk-sdk` container is mounted where you have exeucted the docker build command.

Open up this location and navigate inside `/dev_environment`.
Inside this folder, you will find a folder `/lisk-sdk-examples` which holds the full code for the workshop. 
By default, the script also installs all dependencies with `npm install`.

**Note: In order to make this setup work, we've added a simple line to the `/transport/node/index.js` file for starting the node.**

As we asigned the database Docker container a virtual address called `db`, we have to tell our node that it needs to use `db` as the host name for connecting to our Dockerized Postgres database: 

```js
configDevnet.components.storage.host = 'db';
```

# Verify Installation
At last, it is important to verify the installation.

Verify if the installation works by entering the lisk-sdk container with `docker exec -it <container ID> /bin/bash` and navigate inside the `/transport/node` folder.

First, we need to install the dependencies. We both have to install the dependencies for `/transport/transactions` and `/transport/node`.

```bash
cd transport/transactions
npm install
cd ../node
npm install
```

Next, now we are in the `/transport/node` folder, run `node index.js | npx bunyan -o short` - if no errors are displayed and the node starts running, the installation is working correctly.

# Take Down Docker Containers
You can simply take down the containers by executing the following command in the same folder `/transport/node`:

```sh
docker-compose down
```
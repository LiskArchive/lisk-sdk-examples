# Lisk Invoice Client
This is the client to the Invoice SDK PoC

## Installation
> Before installing the Lisk SDK, make sure to follow the instructions in the [Lisk SDK - Pre-Install](https://github.com/LiskHQ/lisk-docs/blob/development/lisk-sdk/introduction.md#pre-installation) section.

You need the Invoice backend set up and running on [http://localhost:4000](http://localhost:4000). Assuming you start in [/invoice/client`](https://github.com/LiskHQ/lisk-sdk-examples/tree/development/invoice/client) folder.
```
cd ../core
npm i --registry https://npm.lisk.io
node index.js | npx bunyan -o short
```

And then get back to client and install dependencies.

```
cd ../client
npm i --registry https://npm.lisk.io
```


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

![Login page screenshot](./login-page-screenshot.png)

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


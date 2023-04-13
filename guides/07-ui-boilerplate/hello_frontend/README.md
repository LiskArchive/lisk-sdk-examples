
# Steps to re-create the Hello UI template

This project is bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and styled with [Semantic UI](https://semantic-ui.com/introduction/getting-started.html).

## Installation
- In the `hello` directory, run the following command to bootstrap a react app:
```
npx create-react-app hello_frontend
```

- Once the bootstrap is successful, the directory should look like the following:
```
hello/
├── hello_client/
└── hello_frontend/
```

- Install other dependencies:
```
cd hello_frontend
npm install semantic-ui-react semantic-ui-css
npm i react-router
npm i react-router-dom
```

## Implementing a UI template
- Create the `layout` folder inside the `hello/hello_frontend/src` folder.
```
mkdir layout
```

- Inside the `layout` folder, create a file: `header.js`, and paste the contents of [header.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/layout/header.js) in it.

- Create the `components` folder inside the  `hello/hello_frontend/src` directory 
```
mkdir components
```

- Within the `components` folder, do the following:
  - Create [faucet.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/faucet.js) along with its content.
  - Create [getAccountDetails.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/getAccountDetails.js) along with its content.
  - Create [getHello.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/getHello.js) along with its content.
  - Create [home.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/home.js) along with its content.
  - Create [messageTimeline.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/messageTimeline.js) along with its content.
  - Create [newAccount.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/newAccount.js) along with its content.
  - Create [sendHello.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/sendHello.js) along with its content.
  - Create [transfer.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/transfer.js) along with its content.
  
- Update the `hello_frontend/src/App.css` file according to [App.css](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/App.css).

- Update the `hello_frontend/src/App.js` file according to [App.css](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/App.js).

- Insert the following `logo.png` in place of the existing `logo.svg` in the `hello_frontend/src/` directory.

![logo](https://user-images.githubusercontent.com/13951043/218746127-be241607-b647-4295-af65-ee113c140038.png)

- Update the `hello_frontend/public/index.html` file according to [index.html](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/public/index.html).

## Start `hello_frontend`.
```
npm start
```

## Screenshots

After performing all the aforementioned steps, your Hello UI should look like the following:

### Homepage:
![Home](https://user-images.githubusercontent.com/13951043/231733085-de331057-79d5-45e2-b95d-c123b4f7e6ef.jpg)

### New Account Page:
![NewAccount](https://user-images.githubusercontent.com/13951043/231734900-c021b62f-64dc-4e49-8b57-846a6b3fb2cc.jpg)

### Get Account Details Page:
![Getdetails](https://user-images.githubusercontent.com/13951043/231735345-72080b2e-a8c0-4a3c-8d27-ed1795465668.jpg)

### Transfer tokens Page:
![Transfer](https://user-images.githubusercontent.com/13951043/231735536-8ae8343b-d9ae-424c-97f4-f1b27732fe6e.jpg)

### Send Hello Page:
![SendHello](https://user-images.githubusercontent.com/13951043/231735690-f386eab9-472d-4aca-b50a-5d3421ef6a64.jpg)

### Get Hello Page:
![GetHello](https://user-images.githubusercontent.com/13951043/231735871-9f424f3b-cbe1-4282-a94a-893772a47d9e.jpg)

### Faucet Page:
![Faucet](https://user-images.githubusercontent.com/13951043/231736064-cee2b2ad-a304-4202-baf7-d8e91e8444b9.jpg)



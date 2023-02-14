
# Steps to re-create the Hello UI template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and styled with [Semantic UI](https://semantic-ui.com/introduction/getting-started.html).

- In the `hello` directory, run the following command to bootstrap a react app:
```
npx create-react-app hello_frontend
```

- Install other dependencies:
```
npm install semantic-ui-react semantic-ui-css
npm i react-router
npm i react-router-dom
```

- Create the `layout` folder inside the `hello/hello_frontend/src` folder.
```
mkdir layout
```

- Create a file: `header.js`, and paste the contents of [header.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/layout/header.js) in it.

- Create the `components` folder inside the  `hello/hello_frontend/src` directory 
```
mkdir components
```

- Within the `components` folder, do the following:
  - Create [faucet.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/faucet.js) along with its content.
  - Create [getAccountDetails.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/getAccountDetails.js) along with its contents.
  - Create [getHello.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/getHello.js) along with its content.
  - Create [home.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/home.js) along with its content.
  - Create [messageTimeline.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/messageTimeline.js) along with its contents.
  - Create [newAccount.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/newAccount.js) along with its content.
  - Create [sendHello.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/sendHello.js) along with its content.
  - Create [transfer.js](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/components/transfer.js) along with its content.
  
- Update the `hello_frontend/src/App.css` file according to [App.css](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/App.css).

- Update the `hello_frontend/src/App.js` file according to [App.css](https://github.com/LiskHQ/lisk-sdk-examples/blob/development/guides/07-ui-boilerplate/hello_frontend/src/App.js).

- Insert the following logo in the `hello_frontend/src/` directory.

![logo](https://user-images.githubusercontent.com/13951043/218746127-be241607-b647-4295-af65-ee113c140038.png)


- Start `hello_frontend`.
```
npm start
```

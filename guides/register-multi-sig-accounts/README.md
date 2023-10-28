# Steps to run

- Install lisk-sdk by executing the following:
```
npm i
```
- Replace values in the accounts.json file array with the accounts of your node.
- Update the `chainID` in the script to match the `chainID` of the node being used to test the script.
- Execute the script to register a multi-signature account.
```
node register-multiSig-account.js
```
- Invoke `auth_getAuthAccount` to check the account's status.
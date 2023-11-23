# Steps to execute the script

- Register a multi-signature account (You can use [this](https://github.com/LiskHQ/lisk-sdk-examples/tree/development/guides/register-multi-sig-accounts) script).

- Install the `lisk-sdk` package by executing the following:

    ```
    npm install
    ```
- Replace the accounts details available in the `accounts.json` file with the accounts of your node.
- Update the values of the `chainID` and the `tokenID` in the script to match with the node being used to test the script.
- To run the script, the signatory should pass their private key to the following command like this:
    ```
    node create-multiSig-transaction.js SIGNATORY'S_PRIVATE_KEY
    ```
# Steps to execute the script

- Install the `lisk-sdk` package by executing the following:

    ```
    npm install
    ```
- Replace the accounts details available in the `accounts.json` file with the accounts of your node.
- Update the `chainID` in the `register-multiSig-account.js` script to match the `chainID` of the node being used to test the script.
- Execute the aforementioned script to register a multi-signature account.

    ```
    node register-multiSig-account.js
    ```
- Invoke `auth_getAuthAccount` to check the account's status.
The response should be similar to the following:

    ```
    {
        "nonce": "1",
        "numberOfSignatures": 2,
        "mandatoryKeys": [],
        "optionalKeys": [
            "c61cd862a8b7f73857b248a4358a7b35c29ca273d76ba3819e8c54b62801f16e",
            "e98e8a6325730be6bf2644af83d5a0b004bb31c15858fedbd0ac2c1f89e2eece",
            "fad413df3fe5e7961b81ee8dc168d13d7e1f5cccdd062ed77da77142c7d571f0"
        ]
    }
    ```
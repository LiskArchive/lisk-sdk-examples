# Flow from Client Perspective

1. `node create_and_initialize_packet_account.js`: Creates credentials for the packet and funds the packet address with LSK tokens. This script prints the transaction response, credentials object, and transfer transaction (to fund the package account). We will later use these credentials to register the package with a custom transaction.

By funding an account that doesn't exist yet, a default account will be created for that address. This is an important step for registering our package as we will have to modify the asset field of the packet account.

2. `node print_sendable_register_package.js`: Creates a sendable transaction payload to be sent to the transactions endpoint `localhost:4000/api/transactions`.

3. Register carrier (MVP2 implementation)

4. If package is on its way, there is no end timstamp (added by finishTransportTransaction). Also, we need to check for the delivery status which needs to be set to **"ongoing"**. Only if both checks succeed, we can fire the LightAlarmTransaction. (MVP1)
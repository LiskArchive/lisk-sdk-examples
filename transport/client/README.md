# Flow from Client Perspective

1. `node create_and_initialize_packet_account.js`: Creates credentials for the packet and funds the packet address with LSK tokens. This script prints the transaction response, credentials object, and transfer transaction (to fund the package account). We will later use these credentials to register the package with a custom transaction.

By funding an account that doesn't exist yet, a default account will be created for that address. This is an important step for registering our package as we will have to modify the asset field of the packet account.

2. `node print_sendable_registerpackage.js`: 
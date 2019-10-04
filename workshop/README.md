# Workshop: Knowledge Sharing on Custom Transactions

This workshop will guide you through learning about custom transactions with a step-by-step approach.
The workshop demands you actively participate in order to get familiar with custom transactions.

## Concept: LiskBills
This workshop will cover some aspects of using the Alpha SDK for developing custom transactions.
First, we will explore two custom transactions which we used for LiskBills. The idea is that we can send an `invoice_transaction` to send an invoice to a client. Next, the client can fulfil the invoice by sending a `payment_transaction`.

## Setup
1. Clone [Lisk-SDK-Examples](https://github.com/LiskHQ/lisk-sdk-examples) repository locally and checkout branch `workshop-custom-txs-start`.

2. Navigate inside `/workshop` folder and run `npm install` to install the required dependencies.

3. In order to verify the setup is correct, try to run the application with `npm start`. The `npm start` command will run the `index.js` file and pipe the outputted logs to our preferred log formatter Bunyan. If everything is running fine, you can go to the next section.

## Transaction 1: Invoice Transaction
The invoice transaction accepts three parameters (send by the freelancer to client):
```json
{
    "client": "<string: company name>",
    "requestedAmount": "<string: amount of invoice to be paid>",
    "description": "<string: any description of the delivered service>",
}
```

### Implementation Details
- Validate all three parameters
- Keep track of the number of invoices the sender has sent with a property `invoiceCount` in the asset field (type: `number`).
- Keep track of the IDs of the sent invoices in a property `invoicesSent` in the asset field (type: `Array`).

This means that we will be only modifying the sender (freelancer) his account.

### Exploring Invoice Transaction
First of all, navigate in your terminal to the `./transactions` folder. Run `npm install` to again install the required dependencies as we see the `/transactions` folder as a separate module.

Now, let's get technical. Open the file at `./transactions/invoice_transaction.js`. For this transaction, most code is ready so we can learn how to write a custom transaction. After this, we'll be writing the payment transaction ourselves.

### Extending BaseTransaction
First thing to notice, we are extending the `InvoiceTransaction` from the [BaseTransaction class](https://github.com/LiskHQ/lisk-sdk/blob/development/elements/lisk-transactions/src/base_transaction.ts).

#### Getter for TYPE
Static function that returns {number}.

#### Getter for FEE
Static function that returns {number}.
--> 10 ** 8 = 1 LSK

#### prepare()
As we will be only modifying the sender (freelancer) their account, we just need to store this account in the cache of the key-value store. At the moment, we are calling the method through `super`. However, this is a bad practice as the implementation might change inside the `BaseTransaction`. Therefore, we want to go to the `BaseTransaction` to copy the code that caches the sender account.

**Task 1: Go to [BaseTransaction class](https://github.com/LiskHQ/lisk-sdk/blob/development/elements/lisk-transactions/src/base_transaction.ts) at line 399 to copy the implementation.**

Notice, we are looking for an account using the `address` filter. In order to understand better the difference between passing an array or an object to the cache function, I ask you to read up about the difference.

**Task 2: Read about AND and OR filters [at the section `B/ Combining Filters`](https://blog.lisk.io/a-deep-dive-into-custom-transactions-statestore-basetransaction-and-transfertransaction-df769493ccbc)**

#### ValidateAsset()
The `validateAsset` function is responsible for only performing static checks. This means the function is synchronous and cannot retrieve data from the `store` (the cached sender account). Therefore, we can perform initial checks like validating the presence of the parameter and if it has the correct type. Any other validation logic can be applied as long it does not have to await a promise.

As a best practice, we want to define an empty `errors` array which we return at the end of the function.
Next up, we perform validation for each property in the asset field (client, requestedAmount, and description).

In case we find an error, we push a new `TransactionError` into the array. The errors array is returned at the end of the function. In case the function returns an array that contains errors, the transaction will be discarded.

To go deeper into the `TransactionError`, the function is exported by `@liskhq/lisk-transactions`. You can find the constructor [here](https://github.com/LiskHQ/lisk-sdk/blob/development/elements/lisk-transactions/src/errors.ts#L22).

```javascript
public constructor(
    message: string = '',
    id: string = '',
    dataPath: string = '',
    actual?: string | number,
    expected?: string | number,
) { ... }
```

Usage in the `InvoiceTransaction`: 
```javascript
new TransactionError(
    'Invalid "asset.client" defined on transaction',
    this.id,
    '.asset.client',
    this.asset.client,
    'A string value',
)
```

### Solution: Invoice Transaction

<details>
    <summary>Prepare() function:</summary>

    async prepare(store) {
        await store.account.cache([
			{
				address: this.senderId,
			},
		]);
    }
</details>

<details>
    <summary>Undo() function:</summary>

    undoAsset(store) {
        const sender = store.account.get(this.senderId);

		// Rollback invoice count and IDs
		sender.asset.invoiceCount = sender.asset.invoiceCount === 1 ? undefined : --sender.asset.invoiceCount;
		sender.asset.invoicesSent = sender.asset.invoicesSent.length === 1 ? undefined : sender.asset.invoicesSent.splice(
			sender.asset.invoicesSent.indexOf(this.id),
			1,
		);
		store.account.set(sender.address, sender);
        return [];
    }
</details>
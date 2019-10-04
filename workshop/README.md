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

_Solution can be found in the `Solution: Invoice Transaction` section._

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

#### applyAsset()
Finally, we have arrived to the hard work! Let's dissect the function line by line.

```javascript
applyAsset(store) {
    const sender = store.account.get(this.senderId);

    // Save invoice count and IDs
    sender.asset.invoiceCount = sender.asset.invoiceCount === undefined ? 1 : ++sender.asset.invoiceCount;
    sender.asset.invoicesSent = sender.asset.invoicesSent === undefined ? [this.id] : [...sender.asset.invoicesSent, this.id];
    store.account.set(sender.address, sender);
    return [];
}
```

First, we retrieve the data from the store. The store exposes two key-value stores: `account` and `transaction`.
The `account` store is read-write, `transaction` store is read-only.

**Task 3: Read about the exposed methods by both stores [in the section `B/ Retrieving Data`](https://blog.lisk.io/a-deep-dive-into-custom-transactions-statestore-basetransaction-and-transfertransaction-df769493ccbc).**

Now you have read about the exposed methods, you know that the `account` store exposes a `get` function that returns a deep clone of the account object. This means we can freely change properties on the object without having to care about references to the orignal object.

Next, we have to code with the idea that this can be the first custom transaction. This means that the properties like `invoiceCount` and `invoicesSent` do not yet exist in the asset field of the sender account. Therefore, we have this logic to check if the property is undefined or not. If it is, we set the `invoiceCount` to 1, otherwise we increase the count by one.

Same applies to `invoicesSent`. If the property doesn't exist, we create a new array with the id of the transaction. Otherwise, we append the id to the existing array.

Next, we update the object in the key-value store `store.account.set(sender.address, sender)`. We can only save a modified account object by using the address of the account followed by the updated sender object.

```
Note: Under the hood, the cache method retrieves data from the database
and stores this data in an in-memory key-value store inside the Lisk application.

When updating an account with the set method, it doens't mean we are changing the account in the database yet.

Only when the transaction gets into the transaction pool and no errors occur,
the transaction will be applied and the changes we made in the key-value store will be saved to the database.
```

Notice that we return an empty array at the end of the function. The same idea applies here as well. As the `validateAsset()` function does only allow for static checks, more advanced checks that require data from the store can be performed in the `applyAsset()` function. In case of an error, we put the error in an array and return this array. However, for the `invoiceTransaction` we do not require additional validation steps, so we decided to simply return an empty array.

#### undoAsset()
Now it's your turn. Your task is to write the reversed logic of the `applyAsset()` function. The `undoAsset()` function is used to roll back changes that were done by the `applyAsset()` function.

At this moment, the function is called when a fork occurs and we want to switch to a different chain. In that case, we have to undo transactions and we need to know how to undo a transaction for each specific transaction type. That's why we have to define custom undo logic for this custom transaction.

**Task 4: Complete code for undo function:**
1. Retrieve sender account
2. Reduce `invoiceCount` (remember the `undefined` state when it's the first transaction)
3. Remove id from `invoicesSent` array (Tip: use splice - Also remember `undefined` case)
4. Return errors

_Solution can be found in the `Solution: Invoice Transaction` section._

### Testing the InvoiceTransaction
To test the `InvoiceTransaction`, we have to register the custom transaction to our blockchain in the `index.js` file in the root of the `/workshop` folder.

You'll find code that is commented out. Uncomment the line for importing the `InvoiceTransaction` and uncomment the line of code that registers the custom transaction to the application.

Next, verify if everything is fine by starting the application with `npm start`. In order to verify if our custom invoice transaction works, we should send an invoice transaction. The `/workshop/generator/invoice.js` file contains a generator that uses a genesis account with sufficient funds and creates a JSON object (Run `node generator/invoice.js`).

**Task 5: Quickly explore the generator code at `/workshop/generator/invoice.js`. The code displays how you can generate a transaction object on a client. Normally, we would broadcast the transaction via the Lisk API Client, but as we will be sending the payload via Postman, we are just using `console.log` to print the payload.**

However, the generator does not remove fields that have `undefined` value and doesn't put `"` around each property. To speed things up, you'll find a formatted JSON transaction object down below:

<details>
    <summary>Invoice Tx JSON:</summary>

    { 
        "id": "6068542855269194380",
        "amount": "0",
        "type": 13,
        "timestamp": 106087382,
        "senderPublicKey":
        "c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f",
        "senderId": "16313739661670634666L",
        "recipientId": "8273455169423958419L",
        "fee": "100000000",
        "signature":
            "4855b3b65484b94e6653601dfcafe1205a77fd16431c9e034460015ae9c09e1bd81be7877c9b9cca68b63979a3483589f79b2619093f3266e46515f16382cd02",
        "signatures": [],
        "asset":
        { "client": "Michiel GmbH",
            "requestedAmount": "1050000000",
            "description": "Workshop delivered" }
    }
</details>

Now, when the blockchain application is running (`npm start`), let's send the above JSON payload to the transactions endpoint with a POST request: `http://localhost:4000/api/transactions`. You should receive the following success result:

```json
{
    "meta": {
        "status": true
    },
    "data": {
        "message": "Transaction(s) accepted"
    },
    "links": {}
}
```

If you want to be absolutely sure the transaction has been accepted and included in a block, query the following endpoint with the right transaction type as an argument (GET request): `http://localhost:4000/api/transactions?type=13`.

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

## Nuggets of Knowledge for Custom Transactions
Before we continue with the `PaymentTransaction`, let's first explore some important concepts related to custom transactions.

### Why can we access this.id or this.amount?
**Task 6: Read section `7. Why can I use` in the [article](https://blog.lisk.io/a-deep-dive-into-custom-transactions-statestore-basetransaction-and-transfertransaction-df769493ccbc) to learn why we can access these properties.**
The full constructor logic for this can be found on [Github](https://github.com/LiskHQ/lisk-sdk/blob/development/elements/lisk-transactions/src/base_transaction.ts#L142).


### Which filters can we use for the Store?
**Task 7: Read up about which filters we can use and why we can access them. You can find it at section `A/ Filters Usage` in [this article](https://blog.lisk.io/a-deep-dive-into-custom-transactions-statestore-basetransaction-and-transfertransaction-df769493ccbc).**


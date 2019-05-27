### Hello World
Welcome to the step-by-step guide of creating the Hello World application with Lisk Alpha SDK.

The purpose of Hello World application is rather to explain the flow of using Alpha SDK Custom Transaction implementations. 
The implementation is saving the string value of the "hello" transaction's asset property to the asset property of the sender's account.

If the account of an address "16313739661670634666L" is able to afford for a HelloWorld transaction (fee is set to 1 LSK by default), the new "hello" property appears into this account's asset field.
Hello World transaction implements only the required functions from the BaseTransaction abstract interface.
The overview of Custom Transaction implementation you can find in the dedicated section.
So after sending a valid `{"type": 10, "senderId": "16313739661670634666L", ... "asset": { "hello": "world" } }` transaction, the sender's account changes from: `{ address: "16313739661670634666L", ..., asset: null }`, to `{ "address": "16313739661670634666L", ..., "asset": {"hello": "world"}} }`. 

The Hello World implementation goes as following:

#### TYPE

Set the HelloWorld transaction TYPE to 10. Every time a transaction is received, it gets differentiated by the type. The first 10 types, from 0-9 is reserved for the default Lisk Network functions.
```
	static get TYPE () {
		return 10;
	}
```
#### applyAsset

That's where the custom logic of the Hello World app is implemented. 

It shows how to store an additional information about accounts using the `asset` field. The content of property of "hello" transaction's asset gets saved into the "hello" property of the account's asset.

`applyAsset` and `undoAsset` uses the information about the sender's account from the `store`, which is defined in the `prepare` step.

Invoked as part of the `apply` step of the BaseTransaction and block processing.  
```
	applyAsset(store) {
		const sender = store.account.get(this.senderId);
		const newObj = { ...sender, asset: { hello: this.asset.hello } };
		store.account.set(sender.address, newObj);
		return [];
	}
```
#### undoAsset
Inverse of `applyAsset`. Undoes the changes made in applyAsset step - removes the "hello" property from the account's asset field.

```
	undoAsset(store) {
		const sender = store.account.get(this.senderId);
		const oldObj = { ...sender, asset: null };
		store.account.set(sender.address, sender);
		return [];
	}
```
#### validateAsset
Validation of the value of the "hello" property, defined by the HelloWorld transaction signer. The implementation below checks, that the value of the "hello" property needs to be a string, no longer than 64 characters. 
```
	validateAsset() {
		const errors = [];
		if (!this.asset.hello || typeof this.asset.hello !== 'string' || this.asset.hello.length > 64) {
			errors.push(
				new TransactionError(
					'Invalid "asset.hello" defined on transaction',
					this.id,
					'.asset.hello',
					this.asset.hello,
					'A string value no longer than 64 characters',
				)
			);
		}
		return errors;
	}
	
```
#### prepare
Prepares the necessary data for the `apply` and `undo` step.
The "hello" property will be added only to sender's account, therefore it's the only resource needed in the `appluAsset` and `undoAsset` steps. 
```
	async prepare(store) {
		await store.account.cache([
			{
				address: this.senderId,
			},
		]);
	}
}
```

# LiskBills Transactions

The LiskBills proof of concept contains two custom transaction types `13` and `14`, respectively an invoice transaction and a payment transaction.

Both tranactions are used in the LiskBills proof of concept to showcase how to create custom transactions. The concept of LiskBills is that we have a freelancer who completed a task for a client. The freelancer wants to send an invoice (InvoiceTransaction) on the blockchain and the client has to pay for the invoice with a PaymentTransaction.

Let's explore the first transaction type: `InvoiceTransaction`.

## InvoiceTransaction

The invoice transaction is used for sending an invoice request as a freelancer to your client.

### Inputs
The `InvoiceTransaction` requires an `asset` field with the following properties: `client`, `requestedAmount`, and `description`.

Note: The `requestedAmount` input is expressed in Beddows (1 lisk = 10**8 Beddows).

```json
{
    "client": string,
    "requestedAmount": string,
    "description": string,
}
```

Example:
```json
asset: {
    "client": "World GmbH",
    "requestedAmount": `${10 ** 9}`, // 10 Lisk
    "description": "Test invoice",
},
```

### Description
The `InvoiceTransaction` keeps count of the amount of invoices you have sent out with `invoiceCount` property.

Besides that, it also stores the `IDs` of the sent invoices under `invoicesSent`.


## PaymentTransaction

The payment transaction is used for fulfilling/paying for the received invoice.

### Inputs
The `PaymentTransaction` requires an `asset` field which has a `data` property that holds the `ID` of the invoice you want to fulfil.
```json
{
    "data": string,
}
```

Example:
```json
asset: {
    "data": "14582705636451260901",
},
```

### Description
The `PaymentTransaction` extends a normal transfer transaction. Upon receiving the transaction, we will check if the sent amount is equal or greater than the requested amount. Feel free to give an extra tip! Other than that, the `data` field must contain an existing ID that points to an invoice.

# LiskBills Transactions

This package contains two custom transaction types `13` and `14`, respectively an invoice transaction and a payment transaction.
Both tranactions are used in the LiskBills proof of concept to showcase how to create custom transactions.

## InvoiceTransaction

The invoice transaction is used for sending an invoice request as a service provider to your client.

### Inputs
The `InvoiceTransaction` requires the following properties.
```json
{
    "client": string,
    "requestedAmount": string,
    "description": string,
}
```

### Description



## PaymentTransaction


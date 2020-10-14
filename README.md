# Lisk SDK examples

This project contains example blockchain applications using the latest Lisk SDK.
Each example project represents an industry use case in which we showcase the potential of the Lisk SDK and how it can transform this industry.

Currently exist the following example blockchain applications:

SDK v4
- Hello world (beginner example)
- Lisk Transport (**Supply chain industry use case**)

SDK v5
- NFT (non-fungable-token proof-of-concept)

All industry use cases will be kept up to date with the latest Lisk SDK release.
Also, you'll find an `/archive` folder that contains older examples referring to previous Lisk SDK releases. 
At the moment, the `/archive` folder contains examples for Lisk SDK `v2` and `v3`.

## [Hello World](./hello_world)
A hello world application built with the Lisk SDK v4.

Implements the `HelloTransaction`, which is saving a custom string into the senders account.
It also equipped with a basic react frontend app including the most common interactions.

## [Supply chain: Lisk Transport](./transport)
A blockchain application built with the Lisk SDK v4.

Originally, the Lisk Transport workshop has been designed for the **Lisk.js 2019** event.
The project represents a flow where a carrier can sign up to pick up a packet and deliver it to the right person in a decentralized way.
A custom transaction helps with locking the fee for the drive and a warranty in case the package gets damaged or lost.
During the whole transport cycle, the packet is tracked and it can fire alarms that get saved on the blockchain.

In addition, anyone can become a carrier.
For example, you can pick up a packet that has its destination on your daily commute and earn a small reward for this.

## [NFT Demo](./nft)
A blockchain application built with the Lisk SDK v5.

It demonstrates the use of On-Chain and Off-Chain architecture by creating a custom module and a plugin for Lisk application.
A few transactions are also included.
It also equipped with a react frontend app to show the usage of transactions.

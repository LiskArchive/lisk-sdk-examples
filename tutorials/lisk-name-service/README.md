# Lisk Name Service - PoC

This is a NFT Blockchain application created using `Version 5.1.0` of `lisk-sdk`.

This demonstrates On-Chain and Off-Chain architecture of `lisk-sdk`. We will be building an PoC name Lisk Name Service inspired from the ethereum name service to cover the following requirements.

- Able to register .lsk domains.
- Manage and update domain records.
- Able to resolve a domain to an account address.
- Able to reverse lookup an address for its domain.
- Use the domain names in the UI tools instead of account address.

## Install dependencies

```bash
cd lns-dashboard-plugin && npm i && npm run build
cd lns && npm i
```

## Start node

```bash
cd lns
./bin/run start --api-ws
```

## Access UI

Open http://localhost:8000/ in the browser to access the LNS dashboard.

import { cryptography } from '@liskhq/lisk-client/browser';

export const extractAddress = (passphrase: string) => cryptography.address.getBase32AddressFromPassphrase(passphrase);
export const extractHexAddress = (address: string) => cryptography.address.getAddressFromLisk32Address(address);
export const getAddressFromHex = (address: Buffer) => cryptography.address.getBase32AddressFromAddress(address);

import * as Lisk from '@liskhq/lisk-client';

export const extractAddress = (passphrase: string) => Lisk.cryptography.getBase32AddressFromPassphrase(passphrase);
export const extractHexAddress = (address: string) => Lisk.cryptography.getAddressFromLisk32Address(address);

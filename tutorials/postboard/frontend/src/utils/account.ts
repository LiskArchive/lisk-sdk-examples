import { cryptography } from '@liskhq/lisk-client/browser';

export const extractPrivateKey = async (passphrase: string) =>
  await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, "m/44'/134'/0'");
export const extractHexAddress = async (passphrase: string) =>
  //cryptography.address.getAddressFromPrivateKey(await extractPrivateKey(passphrase)).toString('hex');
  cryptography.address.getAddressFromPrivateKey(await extractPrivateKey(passphrase));
//export const extractHexAddress = (address: string) => cryptography.address.getAddressFromLisk32Address(address);
export const getAddressFromHex = (address: Buffer) => cryptography.address.getLisk32AddressFromAddress(address);

import * as Lisk from '@liskhq/lisk-client/browser';

/**
 * Checks validity of passphrase using to mnemonic
 *
 * detects validity of each word individually
 * the result consist of [multiple] object[s]
 * which have a member with a 'code' key whose value
 * is one of the below
 * INVALID_AMOUNT_OF_WORDS
 * INVALID_AMOUNT_OF_WHITESPACES
 * INVALID_AMOUNT_OF_UPPERCASE_CHARACTER
 * INVALID_MNEMONIC
 *
 * and a message which indicates the issue
 * in a more human readable fashion
 *
 * @param {string} passphrase
 * @returns {Array} the validation result containing object[s] with:
 *  {String} code - specified the possible codes in the description above
 *  {String} message - A descriptive message for what went wrong
 */
export const getPassphraseValidationErrors = (passphrase) => {
  if (passphrase.trim().length === 0) {
    return [{ code: 'empty_value', message: 'Invalid Passphrase' }];
  }
  const numberOfWords = Math.ceil(passphrase.trim().split(' ').length / 3) * 3;
  const validPassLength = Math.max(Math.min(numberOfWords, 24), 12);
  return Lisk.passphrase.validation.getPassphraseValidationErrors(passphrase, undefined, validPassLength);
};

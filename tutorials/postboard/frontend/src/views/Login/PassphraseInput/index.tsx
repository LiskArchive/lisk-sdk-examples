/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Button from 'components/Button';
import { AuthContext } from 'context/AuthContext';
import types from 'context/types';
import React, { ClipboardEventHandler, useContext, useState } from 'react';
import { extractHexAddress, getAddressFromHex } from 'utils/account';
import keyCodes from '../../../constants/keyCodes';
import { getPassphraseValidationErrors } from '../../../utils/passphrase';

type PassphraseInputProps = {
  length: number;
  maxInputsLength: number;
  closeModal: () => void;
};

const PassphraseInput = ({ length = 12, maxInputsLength, closeModal }: PassphraseInputProps) => {
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);
  const [values, setValues] = useState<Array<string>>([]);
  const [focus, setFocus] = useState<number>(0);
  const [inputsLength, setInputsLength] = useState<number>(length);
  const [errors, setErrors] = useState<Array<string>>([]);

  const authContext = useContext(AuthContext);

  const keyAction = (event) => {
    let newFocus = focus,
      newInputLength = inputsLength;
    const index = parseInt(event.target.dataset.index, 10);
    if (event.which === keyCodes.space || event.which === keyCodes.arrowRight || event.which === keyCodes.tab) {
      newInputLength = index + 1 > inputsLength - 1 ? maxInputsLength : inputsLength;
      newFocus = index + 1 > inputsLength - 1 ? index : index + 1;
      event.preventDefault();
    }
    if ((event.which === keyCodes.delete && !values[focus]) || event.which === keyCodes.arrowLeft) {
      newFocus = index - 1 < 0 ? index : index - 1;
      event.preventDefault();
    }
    setFocus(newFocus);
    setInputsLength(newInputLength);
  };

  const handlePaste = ({ clipboardData, target }: ClipboardEventHandler<HTMLInputElement>) => {
    let newInputLength = inputsLength,
      newValues = [...values];
    const index = parseInt(target.dataset.index, 10);
    const pastedValue = clipboardData.getData('Text').trim().replace(/\W+/g, ' ').split(/\s/);
    if (pastedValue.length <= 1) {
      values[index] = '';
    } else {
      const insertedValue = [...Array(index), ...pastedValue];
      newInputLength = insertedValue.length > inputsLength ? maxInputsLength : inputsLength;
      newValues = insertedValue.map((value, key) => value || values[key]).splice(0, inputsLength);
    }

    validatePassphrase({ values: newValues, length: newInputLength });
  };

  const handleValueChange = ({ target }: ChangeEventHandler<HTMLInputElement>) => {
    const newValues = [...values];
    const index = parseInt(target.dataset.index, 10);
    const insertedValue = target.value.trim().replace(/\W+/g, ' ');
    if (insertedValue.split(/\s/).length > 1) return;
    newValues[index] = insertedValue;
    validatePassphrase({ values: newValues, focus: index });
  };

  const validatePassphrase = ({ values, length = inputsLength, focus = 0 }) => {
    const passphrase = values.join(' ').trim();
    const validationErrors = getPassphraseValidationErrors(passphrase);
    if (validationErrors.length) {
      setErrors(validationErrors.map((err) => err.message));
    } else {
      setErrors([]);
    }
    setValues(values);
    setInputsLength(length);
    setFocus(focus);
  };

  const onFill = async () => {
    const passphrase = values.join(' ').trim();
    const hexAddress = await extractHexAddress(passphrase);
    const address = getAddressFromHex(hexAddress);

    if (address) {
      authContext.dispatch({ type: types.FETCH_ACCOUNT, payload: { address, passphrase, hexAddress } });
    }
    closeModal();
  };

  const removeFocusedField = () => setFocus(null);

  const setFocusedField = ({ target }) => {
    const focus = parseInt(target.dataset.index, 10);
    const value = target.value;
    target.value = '';
    target.value = value;
    setFocus(focus);
  };

  const handleToggleShowPassphrase = () => setShowPassphrase(!showPassphrase);

  return (
    <>
      <div className={'wrapper'}>
        <label className={`showPassphrase`} onClick={handleToggleShowPassphrase}>
          <span className={`label`}>{showPassphrase ? 'Hide' : 'Show'}</span>
        </label>
        <div className="clearfix"></div>
        <div className={`inputs ${errors.length && 'error'}`}>
          {[...Array(inputsLength)].map((x, i) => (
            <span key={i} className={'inputContainer'} autoComplete="off">
              <span className={'inputNumber'}>{`${i + 1}. `}</span>
              <input
                ref={(ref) => ref !== null && focus === i && ref.focus()}
                placeholder="_________"
                className={focus === i ? 'selected' : ''}
                value={values[i] || ''}
                type={showPassphrase ? 'text' : 'password'}
                autoComplete="off"
                onBlur={removeFocusedField}
                onFocus={setFocusedField}
                onPaste={handlePaste}
                onChange={handleValueChange}
                onKeyDown={keyAction}
                data-index={i}
              />
            </span>
          ))}
        </div>
        <div className="text-center">
          <Button className="mt-3" onClick={onFill} disabled={errors.length}>
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

export default PassphraseInput;

import { AlertContext } from 'context/AlertContext';
import types from 'context/types';
import { useContext } from 'react';

const useAlert = () => {
  const { dispatch } = useContext(AlertContext);
  const showSuccessAlert = (message: string) =>
    dispatch({ type: types.ADD_ALERT, payload: { message, type: 'success' } });
  const showErrorAlert = (message: string) => dispatch({ type: types.ADD_ALERT, payload: { message, type: 'danger' } });

  return { showSuccessAlert, showErrorAlert };
};

export default useAlert;

import { useReducer } from 'react';
import { AlertContextState, AlertActionType } from './AlertContext';
import types from './types';

const initialState: AlertContextState = {
  message: undefined,
  type: undefined,
};

function reducer(state: AlertContextState, action: AlertActionType) {
  switch (action.type) {
    case types.ADD_ALERT:
      return {
        ...state,
        ...action.payload,
      };
    case types.REMOVE_ALERT:
      return {
        message: undefined,
        type: undefined,
      };
    default:
      return state;
  }
}

const useAlertController = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useAlertController;

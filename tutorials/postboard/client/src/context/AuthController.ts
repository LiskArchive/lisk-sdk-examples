import { useReducer } from 'react';
import { AuthContextState, AuthActionType } from './AuthContext';
import types from './types';

const initialState: AuthContextState = {
  address: '',
  passphrase: '',
  hexAddress: '',
};

function reducer(state: AuthContextState, action: AuthActionType) {
  switch (action.type) {
    case types.FETCH_ACCOUNT:
      return {
        ...state,
        address: action.payload.address,
        passphrase: action.payload.passphrase,
        hexAddress: action.payload.hexAddress,
      };
    case types.LOG_OUT:
      return {
        ...state,
        address: '',
      };
    default:
      return state;
  }
}

const useAuthController = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};

export default useAuthController;

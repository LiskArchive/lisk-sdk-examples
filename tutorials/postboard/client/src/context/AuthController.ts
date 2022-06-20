import { Reducer, useEffect, useReducer } from 'react';
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
      localStorage.setItem('@postboard', JSON.stringify(initialState));
      return {
        ...state,
        address: '',
      };
    default:
      return state;
  }
}

const useAuthController = () => {
  const [state, dispatch] = useReducer<Reducer<AuthContextState, AuthActionType>>(reducer, initialState);

  useEffect(() => {
    if (state.address) {
      localStorage.setItem('@postboard', JSON.stringify(state));
    }
  }, [state]);

  useEffect(() => {
    const store = localStorage.getItem('@postboard');
    if (store) {
      dispatch({ type: types.FETCH_ACCOUNT, payload: JSON.parse(store) });
    }
  }, []);

  return { state, dispatch };
};

export default useAuthController;

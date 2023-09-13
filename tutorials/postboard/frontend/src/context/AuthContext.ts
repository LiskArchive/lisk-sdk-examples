import { createContext, Dispatch } from 'react';

export type AuthContextState = {
  address: string;
  passphrase: string;
  hexAddress: string;
};

export type AuthActionType = { type: string; payload: AuthContextState };

type AuthContext = {
  state: AuthContextState;
  dispatch: Dispatch<AuthActionType>;
};

export const AuthContext = createContext({} as AuthContext);

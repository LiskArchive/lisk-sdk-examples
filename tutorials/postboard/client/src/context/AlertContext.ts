import { createContext, Dispatch } from 'react';

export type AlertContextState = {
  message?: string;
  type?: 'success' | 'danger';
};

export type AlertActionType = { type: string; payload: AlertContextState };

type AlertContext = {
  state: AlertContextState;
  dispatch: Dispatch<AlertActionType>;
};

export const AlertContext = createContext({} as AlertContext);

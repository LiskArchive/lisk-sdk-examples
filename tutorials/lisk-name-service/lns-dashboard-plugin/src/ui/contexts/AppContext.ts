import { apiClient } from '@liskhq/lisk-client';
import * as React from 'react';

export interface AppState {
	ready: boolean;
	enableLNSNames: boolean;
}

export interface AppContextState {
	client: apiClient.APIClient;
	appState: AppState;
	setAppState: (state: AppState) => void;
}

export const appContextDefaultValues: AppContextState = {
	appState: {
		ready: false,
		enableLNSNames: true,
	},
	setAppState: (_: AppState) => {
		//
	},
	client: {} as never,
};

const AppContext = React.createContext<AppContextState>(appContextDefaultValues);

export default AppContext;

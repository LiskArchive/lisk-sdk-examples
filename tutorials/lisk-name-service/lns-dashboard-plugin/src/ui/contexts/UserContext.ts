import * as React from 'react';
import { User } from '../types';

export const userDefaultValue = { address: '', lisk32Address: '', publicKey: '' };

const UserContext = React.createContext<{
	connected: boolean;
	user: User;
	setUser: (u?: User) => void;
}>({
	connected: false,
	user: userDefaultValue,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setUser: () => {},
});

export default UserContext;

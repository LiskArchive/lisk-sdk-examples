import * as React from 'react';

const useStateWithLocalStorage = <T>(
	localStorageKey: string,
	defaultValue?: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
	const exitingKey = localStorage.getItem(localStorageKey);

	const [value, setValue] = React.useState<T>(
		exitingKey === null ? defaultValue : JSON.parse(exitingKey),
	);

	React.useEffect(() => {
		localStorage.setItem(localStorageKey, JSON.stringify(value));
	}, [value]);

	return [value, setValue];
};

export default useStateWithLocalStorage;

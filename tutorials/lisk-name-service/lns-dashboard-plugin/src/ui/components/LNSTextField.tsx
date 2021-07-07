import { cryptography } from '@liskhq/lisk-client';
import { TextField, TextFieldProps } from '@material-ui/core';
import * as React from 'react';
import AppContext from '../contexts/AppContext';
import { LNSNodeJSON } from '../types';

const LNSTextField: React.FC<
	Omit<TextFieldProps, 'onChange' | 'error' | 'helperText'> & {
		binaryAddress?: string;
		name?: string;
		onResolveAddress?: (lisk32Address: string) => void;
	}
> = props => {
	const { binaryAddress, name, onResolveAddress, ...rest } = props;
	const { client, appState } = React.useContext(AppContext);
	const [error, setError] = React.useState(false);
	const [helperText, setHelperText] = React.useState('');
	const [lisk32Address, setLisk32Address] = React.useState(
		binaryAddress
			? cryptography.getLisk32AddressFromAddress(Buffer.from(binaryAddress, 'hex'))
			: '',
	);
	const [value, setValue] = React.useState<string>(
		// eslint-disable-next-line no-nested-ternary
		appState.enableLNSNames ? (props.name ? props.name : '') : lisk32Address,
	);

	const handleResolveName = async () => {
		if (!client || !appState.enableLNSNames) {
			if (onResolveAddress) {
				onResolveAddress(value);
			}
			return;
		}

		try {
			const node = await client?.invoke<LNSNodeJSON>('lns:resolveName', {
				name: value,
			});

			const address = cryptography.getLisk32AddressFromAddress(
				Buffer.from(node.ownerAddress, 'hex'),
			);
			setLisk32Address(address);
			setError(false);
			setHelperText(appState.enableLNSNames ? address : '');
			if (onResolveAddress) {
				onResolveAddress(appState.enableLNSNames ? address : '');
			}
		} catch (e) {
			setError(true);
			setHelperText('Can not resolve name');
			if (onResolveAddress) {
				onResolveAddress(value);
			}
		}
	};

	React.useEffect(() => {
		handleResolveName().catch(console.error);
	}, [client, appState.enableLNSNames, props.binaryAddress, props.name]);

	React.useEffect(() => {
		handleResolveName().catch(console.error);
	}, [value]);

	return (
		<TextField
			{...rest}
			error={error}
			helperText={helperText}
			value={value}
			onChange={e => setValue(e.target.value)}
		/>
	);
};

export default LNSTextField;

import { cryptography } from '@liskhq/lisk-client';
import * as React from 'react';
import AppContext from '../contexts/AppContext';
import { LNSNodeJSON } from '../types';

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

const LNSLabel: React.FC<XOR<{ binaryAddress: string }, { publicKey: string }>> = props => {
	const { client, appState } = React.useContext(AppContext);
	const [address] = React.useState(
		// eslint-disable-next-line no-nested-ternary
		props.binaryAddress
			? props.binaryAddress
			: props.publicKey
			? cryptography.getAddressFromPublicKey(Buffer.from(props.publicKey, 'hex')).toString('hex')
			: '',
	);
	const [lisk32Address] = React.useState(
		cryptography.getLisk32AddressFromAddress(Buffer.from(address, 'hex')),
	);
	const [reverseName, setReverseName] = React.useState<string | undefined>(undefined);

	React.useEffect(() => {
		const run = async () => {
			try {
				const node = await client?.invoke<LNSNodeJSON>('lns:lookupAddress', {
					address,
				});
				setReverseName(node?.name);
			} catch {
				// console.error('Can not lookup address name for ', address);
			}
		};

		if (client && appState.enableLNSNames) {
			run().catch(console.error);
		}
	}, [client, appState.enableLNSNames, props.binaryAddress, props.publicKey]);

	return (
		<span title={lisk32Address}>
			{appState.enableLNSNames && reverseName ? reverseName : lisk32Address}
		</span>
	);
};

export default LNSLabel;

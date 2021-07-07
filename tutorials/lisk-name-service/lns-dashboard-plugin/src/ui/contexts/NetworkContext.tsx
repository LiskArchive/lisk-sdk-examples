import * as React from 'react';
import TransactionConfirmationDialog from '../components/utils/TransactionConfirmationDialog';

interface NetworkContextProps {
	waitTxConfirmation: (id: string, cb?: () => void) => void;
}

export const NetworkContext = React.createContext<NetworkContextProps>({
	waitTxConfirmation: (_id: string) => {
		/** */
	},
});

export const NetworkContextProvider: React.FC = props => {
	const [state, updateState] = React.useState<{
		txWaitDialog: boolean;
		txWaitId: string;
		txWaitCb?: () => void;
	}>({
		txWaitDialog: false,
		txWaitId: '',
	});

	const waitTxConfirmation = (id: string, cb?: () => void) => {
		updateState({ ...state, txWaitDialog: true, txWaitId: id, txWaitCb: cb });
	};

	return (
		<React.Fragment>
			<NetworkContext.Provider value={{ waitTxConfirmation }}>
				<TransactionConfirmationDialog
					open={state.txWaitDialog}
					transactionId={state.txWaitId}
					onConfirmation={state.txWaitCb}
				/>
				{props.children}
			</NetworkContext.Provider>
		</React.Fragment>
	);
};

import { Dialog, DialogContent, DialogProps, DialogTitle, Typography } from '@material-ui/core';
import * as React from 'react';
import EventEmitterContext, { NEW_CONFIRMED_TX_EVENT } from '../../contexts/EventEmitterContext';

interface TransactionWaitDialogProps extends DialogProps {
	transactionId: string;
	onConfirmation?: () => void;
}

const TransactionConfirmationDialog: React.FC<TransactionWaitDialogProps> = props => {
	const { onClose, open, transactionId, onConfirmation, ...rest } = props;
	const [localOpen, setLocalOpen] = React.useState(open);
	const eventEmitter = React.useContext(EventEmitterContext);

	React.useEffect(() => {
		if (!open) {
			return;
		}

		setLocalOpen(true);

		const cb = (tx: { id: string }) => {
			if (tx.id === transactionId) {
				setLocalOpen(false);
				if (onConfirmation) {
					onConfirmation();
				}
			}
		};

		eventEmitter.on(NEW_CONFIRMED_TX_EVENT, cb);

		// eslint-disable-next-line consistent-return
		return function cleanup() {
			eventEmitter.off(NEW_CONFIRMED_TX_EVENT, cb);
		};
	}, [open]);

	return (
		<Dialog {...rest} open={localOpen}>
			<DialogTitle id="simple-dialog-title">Waiting for transaction confirmation... </DialogTitle>
			<DialogContent>
				<Typography variant={'h6'}></Typography>
				<Typography variant={'body1'}>{transactionId}</Typography>
			</DialogContent>
		</Dialog>
	);
};

export default TransactionConfirmationDialog;

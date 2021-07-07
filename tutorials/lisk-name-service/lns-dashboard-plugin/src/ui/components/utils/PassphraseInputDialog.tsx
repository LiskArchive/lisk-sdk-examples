import * as React from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogProps,
	DialogTitle,
	TextField,
} from '@material-ui/core';

const PassphraseInputDialog: React.FC<DialogProps> = props => {
	const { onClose, open, ...rest } = props;
	const [passphrase, setPassphrase] = React.useState('');
	const [localOpen, setLocalOpen] = React.useState(open);

	const handleClose = () => {
		const e = new CustomEvent('PassphraseCollected', { detail: { passphrase } });
		setLocalOpen(false);

		if (onClose) {
			onClose(e, 'escapeKeyDown');
		}
	};

	React.useEffect(() => {
		if (open) {
			setLocalOpen(true);
		}
	}, [open]);

	return (
		<Dialog {...rest} open={localOpen}>
			<DialogTitle id="simple-dialog-title">Enter your passphrase</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Passphrase"
					type="email"
					fullWidth
					value={passphrase}
					onChange={e => setPassphrase(e.target.value)}
					multiline
					rows={4}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PassphraseInputDialog;

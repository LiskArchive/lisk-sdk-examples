import { cryptography } from '@liskhq/lisk-client';
import { Button, makeStyles } from '@material-ui/core';
import * as React from 'react';
import UserContext from '../contexts/UserContext';
import PassphraseInputDialog from './utils/PassphraseInputDialog';

const useStyles = makeStyles(theme => ({
	link: {
		margin: theme.spacing(1, 1.5),
	},
}));

const Connect: React.FC = () => {
	const { connected, setUser } = React.useContext(UserContext);
	const [open, setOpen] = React.useState(false);
	const classes = useStyles();

	const handleClose = (e: CustomEvent) => {
		setOpen(false);
		const { passphrase } = e.detail as { passphrase: string };
		const { address, publicKey } = cryptography.getAddressAndPublicKeyFromPassphrase(passphrase);
		const lisk32Address = cryptography.getLisk32AddressFromAddress(address);
		setUser({
			address: address.toString('hex'),
			publicKey: publicKey.toString('hex'),
			lisk32Address,
		});
	};

	return (
		<React.Fragment>
			{connected ? (
				<Button
					href="#"
					color="primary"
					variant="outlined"
					className={classes.link}
					onClick={() => setUser(undefined)}
				>
					Disconnect
				</Button>
			) : (
				<React.Fragment>
					<Button
						href="#"
						color="primary"
						variant="outlined"
						className={classes.link}
						onClick={() => setOpen(true)}
					>
						Connect
					</Button>

					<PassphraseInputDialog
						open={open}
						onClose={handleClose}
						maxWidth={'sm'}
						fullWidth={true}
					/>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

export default Connect;

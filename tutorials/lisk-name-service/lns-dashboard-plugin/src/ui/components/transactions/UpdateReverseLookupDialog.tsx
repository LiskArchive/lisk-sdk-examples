import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogProps,
	DialogTitle,
	makeStyles,
	MenuItem,
	TextField,
} from '@material-ui/core';
import * as React from 'react';
import AppContext from '../../contexts/AppContext';
import { NetworkContext } from '../../contexts/NetworkContext';
import UserContext from '../../contexts/UserContext';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			marginBottom: theme.spacing(2),
		},
	},
}));

const UpdateReverseLookupDialog: React.FC<
	DialogProps & { existingName: string; newNames: string[] }
> = props => {
	const classes = useStyles();
	const { user } = React.useContext(UserContext);
	const { client } = React.useContext(AppContext);
	const { open, existingName, newNames, ...rest } = props;
	const [localOpen, setLocalOpen] = React.useState(open);
	const [fee, setFee] = React.useState('0');
	const [minFee, setMinFee] = React.useState('0');
	const [passphrase, setPassphrase] = React.useState('');
	const [selectedName, setSelectedName] = React.useState('');
	const { waitTxConfirmation } = React.useContext(NetworkContext);

	const createTx = async () =>
		client.transaction.create(
			{
				moduleName: 'lns',
				assetName: 'reverse-lookup',
				fee: BigInt(fee),
				senderPublicKey: Buffer.from(user.publicKey, 'hex'),
				asset: { name: selectedName },
			},
			passphrase,
		);

	const updateReverseLookup = async () => {
		if (selectedName === existingName) {
			return;
		}

		const res = await client.transaction.send(await createTx());
		setLocalOpen(false);
		waitTxConfirmation(res.transactionId, () => {
			window.location.reload();
		});
	};

	const updateMinFee = async () => {
		const trs = await createTx();
		setMinFee(client.transaction.computeMinFee(trs).toString());
	};

	React.useEffect(() => {
		if (open) {
			setLocalOpen(true);
		}
	}, [open]);

	return (
		<Dialog {...rest} open={localOpen}>
			<DialogTitle id="simple-dialog-title">Update reverse lookup: {existingName}</DialogTitle>
			<DialogContent>
				<div className={classes.root}>
					<TextField
						select
						label="New Name"
						variant="filled"
						fullWidth
						onChange={e => {
							setSelectedName(e.target.value);
							updateMinFee().catch(console.error);
						}}
						value={existingName}
					>
						<MenuItem value={''}></MenuItem>
						{newNames.map(n => (
							<MenuItem key={n} value={n}>
								{n}
							</MenuItem>
						))}
					</TextField>

					<TextField
						label="Passphrase"
						value={passphrase}
						onChange={e => {
							setPassphrase(e.target.value);
							updateMinFee().catch(console.error);
						}}
						variant="filled"
						fullWidth
						multiline
						rows={4}
					/>

					<TextField
						label="Fee"
						value={fee}
						onChange={e => {
							setFee(e.target.value);
							updateMinFee().catch(console.error);
						}}
						variant="filled"
						fullWidth
						helperText={`Minimum Fee: ${minFee}`}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setLocalOpen(false)} color="primary">
					Close
				</Button>

				<Button onClick={updateReverseLookup} color="primary">
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UpdateReverseLookupDialog;

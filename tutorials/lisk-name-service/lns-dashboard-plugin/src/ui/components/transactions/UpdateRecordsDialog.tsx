import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogProps,
	DialogTitle,
	makeStyles,
	TextField,
} from '@material-ui/core';
import * as React from 'react';
import AppContext from '../../contexts/AppContext';
import { NetworkContext } from '../../contexts/NetworkContext';
import UserContext from '../../contexts/UserContext';
import { LNSNodeRecordJSON } from '../../types';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			marginBottom: theme.spacing(2),
		},
	},
}));

const UpdateRecordsDialog: React.FC<
	DialogProps & { name: string; records: LNSNodeRecordJSON[] }
> = props => {
	const classes = useStyles();
	const { user } = React.useContext(UserContext);
	const { client } = React.useContext(AppContext);
	const { open, name, records, ...rest } = props;
	const [localOpen, setLocalOpen] = React.useState(open);
	const [fee, setFee] = React.useState('0');
	const [minFee, setMinFee] = React.useState('0');
	const [passphrase, setPassphrase] = React.useState('');
	const { waitTxConfirmation } = React.useContext(NetworkContext);

	const createTx = async () =>
		client.transaction.create(
			{
				moduleName: 'lns',
				assetName: 'update-records',
				fee: BigInt(fee),
				senderPublicKey: Buffer.from(user.publicKey, 'hex'),
				asset: { name, records },
			},
			passphrase,
		);

	const updateRecords = async () => {
		const res = await client.transaction.send(await createTx());
		setLocalOpen(false);
		waitTxConfirmation(res.transactionId, () => {
			console.info('Records updated....');
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
			<DialogTitle id="simple-dialog-title">Update records for: {name}</DialogTitle>
			<DialogContent>
				<div className={classes.root}>
					<TextField
						label="Records"
						variant="filled"
						fullWidth
						value={JSON.stringify(records)}
						InputProps={{ readOnly: true }}
					/>

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

				<Button onClick={updateRecords} color="primary">
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UpdateRecordsDialog;

import { cryptography, transactions } from '@liskhq/lisk-client';
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
import { useHistory } from 'react-router-dom';
import AppContext from '../../contexts/AppContext';
import { NetworkContext } from '../../contexts/NetworkContext';
import UserContext from '../../contexts/UserContext';
import LNSTextField from '../LNSTextField';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiTextField-root': {
			marginBottom: theme.spacing(2),
		},
	},
}));

const TransferFundsDialog: React.FC<DialogProps> = props => {
	const classes = useStyles();
	const { user } = React.useContext(UserContext);
	const { client } = React.useContext(AppContext);
	const { open, ...rest } = props;
	const [localOpen, setLocalOpen] = React.useState(open);
	const [recipient, setRecipient] = React.useState('');
	const [fee, setFee] = React.useState('0');
	const [amount, setAmount] = React.useState('0');
	const [memo, setMemo] = React.useState('');
	const [minFee, setMinFee] = React.useState('0');
	const [passphrase, setPassphrase] = React.useState('');
	const { waitTxConfirmation } = React.useContext(NetworkContext);
	const history = useHistory();

	const createTx = async () =>
		client.transaction.create(
			{
				moduleName: 'token',
				assetName: 'transfer',
				fee: BigInt(fee),
				senderPublicKey: Buffer.from(user.publicKey, 'hex'),
				asset: {
					recipientAddress: cryptography.getAddressFromLisk32Address(recipient),
					amount: BigInt(transactions.convertLSKToBeddows(amount)),
					data: memo ?? '',
				},
			},
			passphrase,
		);

	const transferFunds = async () => {
		const res = await client.transaction.send(await createTx());
		setLocalOpen(false);
		waitTxConfirmation(res.transactionId, () => {
			history.push('/');
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
			<DialogTitle id="simple-dialog-title">Transfer Funds</DialogTitle>
			<DialogContent>
				<div className={classes.root}>
					<LNSTextField
						label="Recipient"
						value={''}
						onResolveAddress={address => {
							setRecipient(address);
						}}
						variant="filled"
						fullWidth
					/>

					<TextField
						label="Amount"
						value={amount}
						onChange={e => {
							setAmount(e.target.value);
							updateMinFee().catch(console.error);
						}}
						variant="filled"
						fullWidth
						helperText={'In LSK tokens'}
					/>

					<TextField
						label="Memo"
						value={memo}
						onChange={e => {
							setMemo(e.target.value);
							updateMinFee().catch(console.error);
						}}
						variant="filled"
						fullWidth
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

				<Button onClick={transferFunds} color="primary">
					Transfer
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default TransferFundsDialog;

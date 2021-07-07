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
import { useHistory } from 'react-router-dom';
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

const RegisterNameDialog: React.FC<DialogProps & { name: string }> = props => {
	const classes = useStyles();
	const { user } = React.useContext(UserContext);
	const { client } = React.useContext(AppContext);
	const { open, ...rest } = props;
	const [localOpen, setLocalOpen] = React.useState(open);
	const [registerFor, setRegisterFor] = React.useState(1);
	const [fee, setFee] = React.useState('0');
	const [ttl, setTtl] = React.useState('3600');
	const [minFee, setMinFee] = React.useState('0');
	const [passphrase, setPassphrase] = React.useState('');
	const { waitTxConfirmation } = React.useContext(NetworkContext);
	const history = useHistory();

	const createTx = async () =>
		client.transaction.create(
			{
				moduleName: 'lns',
				assetName: 'register',
				fee: BigInt(fee),
				senderPublicKey: Buffer.from(user.publicKey, 'hex'),
				asset: { name: props.name, ttl: parseInt(ttl, 10), registerFor },
			},
			passphrase,
		);

	const registerName = async () => {
		const res = await client.transaction.send(await createTx());
		setLocalOpen(false);
		waitTxConfirmation(res.transactionId, () => {
			history.push('/profile');
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
			<DialogTitle id="simple-dialog-title">Register lisk name: {props.name}</DialogTitle>
			<DialogContent>
				<div className={classes.root}>
					<TextField
						select
						label="Register for"
						value={registerFor}
						onChange={e => {
							setRegisterFor(parseInt(e.target.value, 10));
							updateMinFee().catch(console.error);
						}}
						variant="filled"
						fullWidth
					>
						<MenuItem value={1}>1 Year</MenuItem>
						<MenuItem value={2}>2 Years</MenuItem>
						<MenuItem value={3}>3 Years</MenuItem>
						<MenuItem value={4}>4 Years</MenuItem>
						<MenuItem value={5}>5 Years</MenuItem>
					</TextField>

					<TextField
						label="TTL"
						value={ttl}
						onChange={e => {
							setTtl(e.target.value);
							updateMinFee().catch(console.error);
						}}
						variant="filled"
						fullWidth
						helperText={'Time to live. Will be used by clients to cache.'}
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

				<Button onClick={registerName} color="primary">
					Register
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RegisterNameDialog;

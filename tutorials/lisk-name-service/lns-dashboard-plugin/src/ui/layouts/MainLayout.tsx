import {
	AppBar,
	Box,
	Button,
	Container,
	FormControlLabel,
	Link,
	Switch,
	Toolbar,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Connect from '../components/Connect';
import Copyright from '../components/Copyright';
import LNSName from '../components/LNSLabel';
import { SearchBar } from '../components/SearchBar';
import TransferFundsDialog from '../components/transactions/TransferFundsDialog';
import AppContext from '../contexts/AppContext';
import UserContext from '../contexts/UserContext';

const useStyles = makeStyles(theme => ({
	appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`,
	},
	toolbar: {
		flexWrap: 'wrap',
	},
	toolbarTitle: {
		flexGrow: 1,
	},
	link: {
		margin: theme.spacing(1, 1.5),
	},
	footer: {
		borderTop: `1px solid ${theme.palette.divider}`,
		marginTop: theme.spacing(8),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		[theme.breakpoints.up('sm')]: {
			paddingTop: theme.spacing(6),
			paddingBottom: theme.spacing(6),
		},
	},
	search: {
		position: 'relative',
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
}));

const MainLayout: React.FC<{ searchTerm?: string; disableSearch?: boolean }> = props => {
	const { appState, setAppState } = React.useContext(AppContext);
	const { connected, user } = React.useContext(UserContext);
	const [transferFundsDialog, setTransferFundsDialog] = React.useState(false);
	const classes = useStyles();

	return (
		<React.Fragment>
			<AppBar position="static" color="default" elevation={0} className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					<Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
						<Link to={'/'} component={RouterLink}>
							Lisk Name Service
						</Link>
					</Typography>

					{!props.disableSearch && (
						<div className={classes.search}>
							<SearchBar term={props.searchTerm} />
						</div>
					)}

					<nav>
						<FormControlLabel
							control={
								<Switch
									checked={appState.enableLNSNames}
									onChange={() => {
										setAppState({ ...appState, enableLNSNames: !appState.enableLNSNames });
									}}
								/>
							}
							label="Enable LNS"
						/>
						{connected && (
							<React.Fragment>
								<Link
									variant="body1"
									color="textPrimary"
									href="#"
									className={classes.link}
									component={RouterLink}
									to={'/profile'}
								>
									My Account - {user ? <LNSName binaryAddress={user.address} /> : ''}
								</Link>
							</React.Fragment>
						)}
					</nav>
					<Button variant={'outlined'} onClick={() => setTransferFundsDialog(true)}>
						Transfer Funds
					</Button>
					<TransferFundsDialog
						open={transferFundsDialog}
						onClose={() => setTransferFundsDialog(false)}
					/>
					<Connect />
				</Toolbar>
			</AppBar>

			<Container maxWidth="lg" component="main">
				<>{props.children}</>
			</Container>

			<Container maxWidth="lg" component="footer" className={classes.footer}>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		</React.Fragment>
	);
};

export default MainLayout;
